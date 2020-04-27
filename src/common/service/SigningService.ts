/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import DataHash from '@guardtime/common/lib/hash/DataHash';
import { pseudoRandomLong } from '@guardtime/common/lib/random/RandomUtil';
import bigInteger, { BigInteger } from 'big-integer';
import { TlvInputStream } from '../parser/TlvInputStream';
import { KsiSignature } from '../signature/KsiSignature';
import { AggregationRequestPayload } from './AggregationRequestPayload';
import { AggregationRequestPdu } from './AggregationRequestPdu';
import { AggregationResponsePayload } from './AggregationResponsePayload';
import { AggregationResponsePdu } from './AggregationResponsePdu';
import { ErrorPayload } from './ErrorPayload';
import { IServiceCredentials } from './IServiceCredentials';
import { ISigningServiceProtocol } from './ISigningServiceProtocol';
import { KsiRequestBase } from './KsiRequestBase';
import { KsiServiceError } from './KsiServiceError';
import { PduHeader } from './PduHeader';

/**
 * Signing service
 */
export class SigningService {
  private requests: { [key: string]: KsiRequestBase } = {};
  private signingServiceProtocol: ISigningServiceProtocol;
  private signingServiceCredentials: IServiceCredentials;

  constructor(signingServiceProtocol: ISigningServiceProtocol, signingServiceCredentials: IServiceCredentials) {
    this.signingServiceProtocol = signingServiceProtocol;
    this.signingServiceCredentials = signingServiceCredentials;
  }

  private static processPayload(payload: AggregationResponsePayload): KsiSignature {
    if (payload.getStatus().neq(0)) {
      throw new KsiServiceError(
        `Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`
      );
    }

    return KsiSignature.CREATE(payload);
  }

  public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
    const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.signingServiceCredentials.getLoginId());
    const requestId: BigInteger = this.generateRequestId();
    const requestPayload: AggregationRequestPayload = AggregationRequestPayload.CREATE(requestId, hash, level);

    const requestPdu: AggregationRequestPdu = await AggregationRequestPdu.CREATE(
      header,
      requestPayload,
      this.signingServiceCredentials.getHmacAlgorithm(),
      this.signingServiceCredentials.getLoginKey()
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
        this.signingServiceCredentials.getLoginKey()
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
        `Server responded with error message. Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`
      );
    }

    let currentAggregationPayload: AggregationResponsePayload | null = null;
    for (const responsePayload of responsePdu.getAggregationResponsePayloads()) {
      const aggregationPayload: AggregationResponsePayload = responsePayload as AggregationResponsePayload;
      const payloadRequestId: string = aggregationPayload.getRequestId().toString();
      if (!this.requests.hasOwnProperty(payloadRequestId)) {
        console.warn('Aggregation response request ID does not match any request id.');
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
  protected generateRequestId(): BigInteger {
    return pseudoRandomLong();
  }
}
