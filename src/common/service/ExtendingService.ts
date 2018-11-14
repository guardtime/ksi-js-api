import {BigInteger} from 'big-integer';
import {pseudoRandomLong} from 'gt-js-common';
import {TlvInputStream} from '../parser/TlvInputStream';
import {CalendarHashChain} from '../signature/CalendarHashChain';
import {ErrorPayload} from './ErrorPayload';
import {ExtendRequestPayload} from './ExtendRequestPayload';
import {ExtendRequestPdu} from './ExtendRequestPdu';
import {ExtendResponsePayload} from './ExtendResponsePayload';
import {ExtendResponsePdu} from './ExtendResponsePdu';
import {IExtendingServiceProtocol} from './IExtendingServiceProtocol';
import {IServiceCredentials} from './IServiceCredentials';
import {KsiRequestBase} from './KsiRequestBase';
import {KsiServiceError} from './KsiServiceError';
import {PduHeader} from './PduHeader';

/**
 * Extending service
 */
export class ExtendingService {
    private requests: { [key: string]: KsiRequestBase } = {};
    private extendingServiceProtocol: IExtendingServiceProtocol;
    private extendingServiceCredentials: IServiceCredentials;

    constructor(extendingServiceProtocol: IExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials) {
        this.extendingServiceProtocol = extendingServiceProtocol;
        this.extendingServiceCredentials = extendingServiceCredentials;
    }

    private static processPayload(payload: ExtendResponsePayload): CalendarHashChain {
        if (payload.getStatus().neq(0)) {
            // tslint:disable-next-line:max-line-length
            throw new KsiServiceError(`Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }

        return payload.getCalendarHashChain();
    }

    public async extend(aggregationTime: BigInteger, publicationTime: BigInteger | null = null): Promise<CalendarHashChain> {
        const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.extendingServiceCredentials.getLoginId());
        const requestId: BigInteger = this.generateRequestId();
        const requestPayload: ExtendRequestPayload = ExtendRequestPayload.CREATE(requestId, aggregationTime, publicationTime);
        const requestPdu: ExtendRequestPdu = await ExtendRequestPdu.CREATE(header, requestPayload,
                                                                           this.extendingServiceCredentials.getHmacAlgorithm(),
                                                                           this.extendingServiceCredentials.getLoginKey());

        const ksiRequest: KsiRequestBase = this.extendingServiceProtocol.extend(requestPdu.encode());
        this.requests[requestId.toString()] = ksiRequest;
        const responseBytes: Uint8Array | null = await ksiRequest.getResponse();
        if (ksiRequest.isAborted()) {
            return ExtendingService.processPayload(<ExtendResponsePayload>ksiRequest.getAbortResponse());
        }

        const stream: TlvInputStream = new TlvInputStream(<Uint8Array>responseBytes);
        const responsePdu: ExtendResponsePdu = new ExtendResponsePdu(stream.readTag());
        if (stream.getPosition() < stream.getLength()) {
            throw new KsiServiceError(`Response contains more bytes than PDU length.`);
        }

        const errorPayload: ErrorPayload | null = responsePdu.getErrorPayload();
        if (errorPayload !== null) {
            if (responsePdu.getPayloads().length > 0) {
                throw new KsiServiceError(`PDU contains unexpected response payloads!\nPDU:\n${responsePdu}.`);
            }

            // tslint:disable-next-line:max-line-length
            throw new KsiServiceError(`Server responded with error message. Status: ${errorPayload.getStatus()}; Message: ${errorPayload.getErrorMessage()}.`);
        }

        let currentExtendPayload: ExtendResponsePayload | null = null;
        for (const responsePayload of responsePdu.getPayloads()) {
            const extendPayload: ExtendResponsePayload = <ExtendResponsePayload>responsePayload;
            const payloadRequestId: string = extendPayload.getRequestId().toString();
            if (!this.requests.hasOwnProperty(payloadRequestId)) {
                throw new KsiServiceError('Extend response request ID does not match any request id which is sent.');
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

    protected generateRequestId(): BigInteger {
        return pseudoRandomLong();
    }
}
