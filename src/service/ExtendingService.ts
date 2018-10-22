import {BigInteger} from 'big-integer';
import {pseudoRandomLong} from 'gt-js-common';
import {TlvInputStream} from '../parser/TlvInputStream';
import {CalendarHashChain} from '../signature/CalendarHashChain';
import {ErrorPayload} from './ErrorPayload';
import {ExtendingServiceProtocol} from './ExtendingServiceProtocol';
import {ExtendRequestPayload} from './ExtendRequestPayload';
import {ExtendRequestPdu} from './ExtendRequestPdu';
import {ExtendResponsePayload} from './ExtendResponsePayload';
import {ExtendResponsePdu} from './ExtendResponsePdu';
import {IServiceCredentials, isIServiceCredentials} from './IServiceCredentials';
import {KsiRequest} from './KsiRequest';
import {KsiServiceError} from './KsiServiceError';
import {PduHeader} from './PduHeader';

/**
 * Extending service
 */
export class ExtendingService {
    private requests: { [key: string]: KsiRequest } = {};
    private extendingServiceProtocol: ExtendingServiceProtocol;
    private extendingServiceCredentials: IServiceCredentials;

    constructor(extendingServiceProtocol: ExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials) {
        if (!(extendingServiceProtocol instanceof ExtendingServiceProtocol)) {
            throw new KsiServiceError(`Invalid extending service protocol: ${extendingServiceProtocol}`);
        }

        if (!isIServiceCredentials(extendingServiceCredentials)) {
            throw new KsiServiceError(`Invalid extending service credentials: ${extendingServiceCredentials}`);
        }

        this.extendingServiceProtocol = extendingServiceProtocol;
        this.extendingServiceCredentials = extendingServiceCredentials;
    }

    private static processPayload(payload: ExtendResponsePayload | null): CalendarHashChain {
        if (!(payload instanceof ExtendResponsePayload)) {
            throw new KsiServiceError(`Invalid ExtendResponsePayload: ${payload}`);
        }

        if (payload.getStatus().neq(0)) {
            throw new KsiServiceError(`Server responded with error message.
                                       Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }

        return payload.getCalendarHashChain();
    }

    public async extend(aggregationTime: BigInteger, publicationTime: BigInteger | null = null): Promise<CalendarHashChain> {
        const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.extendingServiceCredentials.getLoginId());
        const requestId: BigInteger = pseudoRandomLong();
        const requestPayload: ExtendRequestPayload = ExtendRequestPayload.CREATE(requestId, aggregationTime, publicationTime);
        const requestPdu: ExtendRequestPdu = await ExtendRequestPdu.CREATE(header, requestPayload,
                                                                           this.extendingServiceCredentials.getHmacAlgorithm(),
                                                                           this.extendingServiceCredentials.getLoginKey());

        const ksiRequest: KsiRequest = new KsiRequest(requestPdu.encode());
        this.requests[requestId.toString()] = ksiRequest;
        const responseBytes: Uint8Array | null = await this.extendingServiceProtocol.extend(ksiRequest);
        if (ksiRequest.getAbortSignal().aborted) {
            return ExtendingService.processPayload(<ExtendResponsePayload>ksiRequest.getResponsePdu());
        }

        const stream: TlvInputStream = new TlvInputStream(<Uint8Array>responseBytes);
        const responsePdu: ExtendResponsePdu = new ExtendResponsePdu(stream.readTag());
        if (stream.getPosition() < stream.getLength()) {
            throw new KsiServiceError(`Response contains more bytes than PDU length`);
        }

        const errorPayload: ErrorPayload | null = responsePdu.getErrorPayload();
        if (errorPayload !== null) {
            if (responsePdu.getPayloads().length > 0) {
                throw new KsiServiceError(`PDU contains unexpected response payloads!\nPDU:\n${responsePdu}`);
            }

            throw new KsiServiceError(`Server responded with error message.
                                       Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`);
        }

        let currentExtendPayload: ExtendResponsePayload | null = null;
        for (const responsePayload of responsePdu.getPayloads()) {
            const extendPayload: ExtendResponsePayload = <ExtendResponsePayload>responsePayload;
            const payloadRequestId: string = extendPayload.getRequestId().toString();
            if (!this.requests.hasOwnProperty(payloadRequestId)) {
                throw new KsiServiceError('Extend response request ID does not match any request id which is sent!');
            }

            const request: KsiRequest = this.requests[payloadRequestId];
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
    }
}
