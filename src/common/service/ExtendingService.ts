/*
 * Copyright 2013-2019 Guardtime, Inc.
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

import { pseudoRandomLong } from '@guardtime/common/lib/random/RandomUtil';
import { BigInteger } from 'big-integer';
import { TlvInputStream } from '../parser/TlvInputStream';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { ErrorPayload } from './ErrorPayload';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { ExtendRequestPdu } from './ExtendRequestPdu';
import { ExtendResponsePayload } from './ExtendResponsePayload';
import { ExtendResponsePdu } from './ExtendResponsePdu';
import { IExtendingServiceProtocol } from './IExtendingServiceProtocol';
import { IServiceCredentials } from './IServiceCredentials';
import { KsiRequestBase } from './KsiRequestBase';
import { KsiServiceError } from './KsiServiceError';
import { PduHeader } from './PduHeader';

/**
 * Extending service for getting calendar hash chain.
 */
export class ExtendingService {
  private requests: { [key: string]: KsiRequestBase } = {};
  private extendingServiceProtocol: IExtendingServiceProtocol;
  private extendingServiceCredentials: IServiceCredentials;

  /**
   * Extending service constructor.
   * @param extendingServiceProtocol Extending service protocol.
   * @param extendingServiceCredentials Extending service credentials.
   */
  public constructor(
    extendingServiceProtocol: IExtendingServiceProtocol,
    extendingServiceCredentials: IServiceCredentials
  ) {
    this.extendingServiceProtocol = extendingServiceProtocol;
    this.extendingServiceCredentials = extendingServiceCredentials;
  }

  /**
   * Process extender response payload.
   * @param payload Extender response payload.
   * @returns Calendar hash chain.
   */
  private static processPayload(payload: ExtendResponsePayload): CalendarHashChain {
    if (payload.getStatus().neq(0)) {
      throw new KsiServiceError(
        `Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`
      );
    }

    return payload.getCalendarHashChain();
  }

  /**
   * Get calendar hash chain for given aggregation and publication time.
   * @param aggregationTime Aggregation time.
   * @param publicationTime Publication time, by default null. If null get most recent calendar record.
   * @returns Calendar hash chain promise.
   */
  public async extend(
    aggregationTime: BigInteger,
    publicationTime: BigInteger | null = null
  ): Promise<CalendarHashChain> {
    const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.extendingServiceCredentials.getLoginId());
    const requestId: BigInteger = this.generateRequestId();
    const requestPayload: ExtendRequestPayload = ExtendRequestPayload.CREATE(
      requestId,
      aggregationTime,
      publicationTime
    );
    const requestPdu: ExtendRequestPdu = await ExtendRequestPdu.CREATE(
      header,
      requestPayload,
      this.extendingServiceCredentials.getHmacAlgorithm(),
      this.extendingServiceCredentials.getLoginKey()
    );

    const ksiRequest: KsiRequestBase = this.extendingServiceProtocol.extend(requestPdu.encode());
    this.requests[requestId.toString()] = ksiRequest;
    const responseBytes: Uint8Array | null = await ksiRequest.getResponse();
    if (ksiRequest.isAborted()) {
      return ExtendingService.processPayload(ksiRequest.getAbortResponse() as ExtendResponsePayload);
    }

    const stream: TlvInputStream = new TlvInputStream(responseBytes as Uint8Array);
    const responsePdu: ExtendResponsePdu = new ExtendResponsePdu(stream.readTag());
    if (stream.getPosition() < stream.getLength()) {
      throw new KsiServiceError(`Response contains more bytes than PDU length.`);
    }

    if (
      !(await responsePdu.verifyHmac(
        this.extendingServiceCredentials.getHmacAlgorithm(),
        this.extendingServiceCredentials.getLoginKey()
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

    let currentExtendPayload: ExtendResponsePayload | null = null;
    for (const responsePayload of responsePdu.getExtendResponsePayloads()) {
      const extendPayload: ExtendResponsePayload = responsePayload as ExtendResponsePayload;
      const payloadRequestId: string = extendPayload.getRequestId().toString();
      if (!this.requests.hasOwnProperty(payloadRequestId)) {
        console.warn('Extend response request ID does not match any request id.');
        continue;
      }

      const request: KsiRequestBase = this.requests[payloadRequestId];
      delete this.requests[payloadRequestId];
      if (payloadRequestId !== requestId.toString()) {
        request.abort(extendPayload);
        continue;
      }

      if (currentExtendPayload !== null) {
        throw new KsiServiceError('Multiple extend payload responses in single PDU.');
      }

      currentExtendPayload = extendPayload;
    }

    if (currentExtendPayload === null) {
      throw new KsiServiceError('No matching extending payloads in PDU.');
    }

    return ExtendingService.processPayload(currentExtendPayload);
  }

  /**
   * Generate request ID.
   * @returns Request ID.
   */
  protected generateRequestId(): BigInteger {
    return pseudoRandomLong();
  }
}
