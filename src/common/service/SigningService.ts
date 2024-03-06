/*
 * Copyright 2013-2022 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import bigInteger, { BigInteger } from 'big-integer';
import { DataHash } from '@guardtime/common/lib/hash/DataHash.js';
import { pseudoRandomLong } from '@guardtime/common/lib/random/RandomUtil.js';
import { TlvInputStream } from '../parser/TlvInputStream.js';
import { KsiSignature } from '../signature/KsiSignature.js';
import { AggregationRequestPayload } from './AggregationRequestPayload.js';
import { AggregationRequestPdu } from './AggregationRequestPdu.js';
import { AggregationResponsePayload } from './AggregationResponsePayload.js';
import { AggregationResponsePdu } from './AggregationResponsePdu.js';
import { ErrorPayload } from './ErrorPayload.js';
import { IServiceCredentials } from './IServiceCredentials.js';
import { ISigningServiceProtocol } from './ISigningServiceProtocol.js';
import { KsiRequestBase } from './KsiRequestBase.js';
import { KsiServiceError } from './KsiServiceError.js';
import { PduHeader } from './PduHeader.js';

/**
 * Signing service for signing data.
 */
export class SigningService {
  private requests: { [key: string]: KsiRequestBase } = {};
  private signingServiceProtocol: ISigningServiceProtocol;
  private signingServiceCredentials: IServiceCredentials;

  /**
   * Signing service constructor.
   * @param signingServiceProtocol Signing service protocol.
   * @param signingServiceCredentials Service credentials.
   */
  public constructor(signingServiceProtocol: ISigningServiceProtocol, signingServiceCredentials: IServiceCredentials) {
    this.signingServiceProtocol = signingServiceProtocol;
    this.signingServiceCredentials = signingServiceCredentials;
  }

  /**
   * Process aggregation response payload.
   * @param payload Aggregation response payload.
   * @returns KSI signature.
   */
  private static processPayload(payload: AggregationResponsePayload): KsiSignature {
    if (payload.getStatus().neq(0)) {
      throw new KsiServiceError(
        `Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`,
      );
    }

    return KsiSignature.CREATE(payload);
  }

  /**
   * Sign data hash on given base level of aggregation tree.
   * @param hash Data hash.
   * @param level Aggregation tree level. By default 0.
   * @returns KSI signature promise.
   */
  public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
    const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.signingServiceCredentials.getLoginId());
    const requestId: BigInteger = this.generateRequestId();
    const requestPayload: AggregationRequestPayload = AggregationRequestPayload.CREATE(requestId, hash, level);

    const requestPdu: AggregationRequestPdu = await AggregationRequestPdu.CREATE(
      header,
      requestPayload,
      this.signingServiceCredentials.getHmacAlgorithm(),
      this.signingServiceCredentials.getLoginKey(),
    );

    const ksiRequest: KsiRequestBase = this.signingServiceProtocol.sign(requestPdu.encode());
    this.requests[requestId.toString()] = ksiRequest;
    const responseBytes: Uint8Array | null = await ksiRequest.getResponse();
    if (ksiRequest.isAborted()) {
      return SigningService.processPayload(ksiRequest.getAbortResponse() as AggregationResponsePayload);
    }

    const stream: TlvInputStream = new TlvInputStream(responseBytes as Uint8Array);
    const responsePdu: AggregationResponsePdu = new AggregationResponsePdu(stream.readTag());
    if (stream.getPosition() < stream.getLength()) {
      throw new KsiServiceError(`Response contains more bytes than PDU length.`);
    }

    if (
      !(await responsePdu.verifyHmac(
        this.signingServiceCredentials.getHmacAlgorithm(),
        this.signingServiceCredentials.getLoginKey(),
      ))
    ) {
      throw new KsiServiceError(`Response HMAC is not correct.`);
    }

    const errorPayload: ErrorPayload | null = responsePdu.getErrorPayload();
    if (errorPayload !== null) {
      if (responsePdu.getPayloads().length > 0) {
        throw new KsiServiceError(`PDU contains unexpected response payloads!\nPDU:\n${responsePdu}.`);
      }

      throw new KsiServiceError(
        `Server responded with error message. Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`,
      );
    }

    let currentAggregationPayload: AggregationResponsePayload | null = null;
    for (const responsePayload of responsePdu.getAggregationResponsePayloads()) {
      const aggregationPayload: AggregationResponsePayload = responsePayload as AggregationResponsePayload;
      const payloadRequestId: string = aggregationPayload.getRequestId().toString();
      if (!this.requests.hasOwnProperty(payloadRequestId)) {
        console.warn('Aggregation response request ID does not match any request ID.');
        continue;
      }

      const request: KsiRequestBase = this.requests[payloadRequestId];
      delete this.requests[payloadRequestId];
      if (payloadRequestId !== requestId.toString()) {
        request.abort(aggregationPayload);
        continue;
      }

      if (currentAggregationPayload !== null) {
        throw new KsiServiceError('Multiple aggregation responses in single PDU.');
      }

      currentAggregationPayload = aggregationPayload;
    }

    if (currentAggregationPayload === null) {
      throw new KsiServiceError('No matching aggregation payloads in PDU.');
    }

    return SigningService.processPayload(currentAggregationPayload);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Generate request ID.
   * @returns Request ID.
   */
  protected generateRequestId(): BigInteger {
    return pseudoRandomLong();
  }
}
