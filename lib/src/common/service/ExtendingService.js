var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pseudoRandomLong } from 'gt-js-common';
import { TlvInputStream } from '../parser/TlvInputStream';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { ExtendRequestPdu } from './ExtendRequestPdu';
import { ExtendResponsePayload } from './ExtendResponsePayload';
import { ExtendResponsePdu } from './ExtendResponsePdu';
import { isExtendingServiceProtocol } from './IExtendingServiceProtocol';
import { isIServiceCredentials } from './IServiceCredentials';
import { KsiError } from './KsiError';
import { KsiServiceError } from './KsiServiceError';
import { PduHeader } from './PduHeader';
/**
 * Extending service
 */
export class ExtendingService {
    constructor(extendingServiceProtocol, extendingServiceCredentials) {
        this.requests = {};
        if (!(isExtendingServiceProtocol(extendingServiceProtocol))) {
            throw new KsiError(`Invalid extending service protocol: ${extendingServiceProtocol}`);
        }
        if (!isIServiceCredentials(extendingServiceCredentials)) {
            throw new KsiError(`Invalid extending service credentials: ${extendingServiceCredentials}`);
        }
        this.extendingServiceProtocol = extendingServiceProtocol;
        this.extendingServiceCredentials = extendingServiceCredentials;
    }
    static processPayload(payload) {
        if (!(payload instanceof ExtendResponsePayload)) {
            throw new KsiError(`Invalid ExtendResponsePayload: ${payload}`);
        }
        if (payload.getStatus().neq(0)) {
            // tslint:disable-next-line:max-line-length
            throw new KsiServiceError(`Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }
        return payload.getCalendarHashChain();
    }
    extend(aggregationTime, publicationTime = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = PduHeader.CREATE_FROM_LOGIN_ID(this.extendingServiceCredentials.getLoginId());
            const requestId = pseudoRandomLong();
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
                throw new KsiServiceError(`Response contains more bytes than PDU length`);
            }
            const errorPayload = responsePdu.getErrorPayload();
            if (errorPayload !== null) {
                if (responsePdu.getPayloads().length > 0) {
                    throw new KsiServiceError(`PDU contains unexpected response payloads!\nPDU:\n${responsePdu}`);
                }
                // tslint:disable-next-line:max-line-length
                throw new KsiServiceError(`Server responded with error message. Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`);
            }
            let currentExtendPayload = null;
            for (const responsePayload of responsePdu.getPayloads()) {
                const extendPayload = responsePayload;
                const payloadRequestId = extendPayload.getRequestId().toString();
                if (!this.requests.hasOwnProperty(payloadRequestId)) {
                    throw new KsiServiceError('Extend response request ID does not match any request id which is sent!');
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
            return ExtendingService.processPayload(currentExtendPayload);
        });
    }
}
