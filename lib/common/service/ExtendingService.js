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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pseudoRandomLong } from '@guardtime/gt-js-common';
import { TlvInputStream } from '../parser/TlvInputStream';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { ExtendRequestPdu } from './ExtendRequestPdu';
import { ExtendResponsePdu } from './ExtendResponsePdu';
import { KsiServiceError } from './KsiServiceError';
import { PduHeader } from './PduHeader';
/**
 * Extending service
 */
export class ExtendingService {
    constructor(extendingServiceProtocol, extendingServiceCredentials) {
        this.requests = {};
        this.extendingServiceProtocol = extendingServiceProtocol;
        this.extendingServiceCredentials = extendingServiceCredentials;
    }
    static processPayload(payload) {
        if (payload.getStatus().neq(0)) {
            // tslint:disable-next-line:max-line-length
            throw new KsiServiceError(`Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }
        return payload.getCalendarHashChain();
    }
    extend(aggregationTime, publicationTime = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = PduHeader.CREATE_FROM_LOGIN_ID(this.extendingServiceCredentials.getLoginId());
            const requestId = this.generateRequestId();
            const requestPayload = ExtendRequestPayload.CREATE(requestId, aggregationTime, publicationTime);
            const requestPdu = yield ExtendRequestPdu.CREATE(header, requestPayload, this.extendingServiceCredentials.getHmacAlgorithm(), this.extendingServiceCredentials.getLoginKey());
            const ksiRequest = this.extendingServiceProtocol.extend(requestPdu.encode());
            this.requests[requestId.toString()] = ksiRequest;
            const responseBytes = yield ksiRequest.getResponse();
            if (ksiRequest.isAborted()) {
                return ExtendingService.processPayload(ksiRequest.getAbortResponse());
            }
            const stream = new TlvInputStream(responseBytes);
            const responsePdu = new ExtendResponsePdu(stream.readTag());
            if (stream.getPosition() < stream.getLength()) {
                throw new KsiServiceError(`Response contains more bytes than PDU length.`);
            }
            const errorPayload = responsePdu.getErrorPayload();
            if (errorPayload !== null) {
                if (responsePdu.getPayloads().length > 0) {
                    throw new KsiServiceError(`PDU contains unexpected response payloads!\nPDU:\n${responsePdu}.`);
                }
                // tslint:disable-next-line:max-line-length
                throw new KsiServiceError(`Server responded with error message. Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`);
            }
            let currentExtendPayload = null;
            for (const responsePayload of responsePdu.getPayloads()) {
                const extendPayload = responsePayload;
                const payloadRequestId = extendPayload.getRequestId().toString();
                if (!this.requests.hasOwnProperty(payloadRequestId)) {
                    throw new KsiServiceError('Extend response request ID does not match any request id which is sent.');
                }
                const request = this.requests[payloadRequestId];
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
        });
    }
    generateRequestId() {
        return pseudoRandomLong();
    }
}
