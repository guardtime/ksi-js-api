import bigInteger, {BigInteger} from 'big-integer';
import {DataHash, pseudoRandomLong} from 'gt-js-common';
import {TlvInputStream} from '../parser/TlvInputStream';
import {KsiSignature} from '../signature/KsiSignature';
import {AggregationRequestPayload} from './AggregationRequestPayload';
import {AggregationRequestPdu} from './AggregationRequestPdu';
import {AggregationResponsePayload} from './AggregationResponsePayload';
import {AggregationResponsePdu} from './AggregationResponsePdu';
import {ErrorPayload} from './ErrorPayload';
import {IServiceCredentials, isIServiceCredentials} from './IServiceCredentials';
import {KsiRequest} from './KsiRequest';
import {KsiServiceError} from './KsiServiceError';
import {PduHeader} from './PduHeader';
import {SigningServiceProtocol} from './SigningServiceProtocol';

/**
 * Signing service
 */
export class SigningService {
    private requests: { [key: string]: KsiRequest } = {};
    private signingServiceProtocol: SigningServiceProtocol;
    private signingServiceCredentials: IServiceCredentials;

    constructor(signingServiceProtocol: SigningServiceProtocol, signingServiceCredentials: IServiceCredentials) {
        if (!(signingServiceProtocol instanceof SigningServiceProtocol)) {
            throw new KsiServiceError(`Invalid signing service protocol: ${signingServiceProtocol}`);
        }

        if (!isIServiceCredentials(signingServiceCredentials)) {
            throw new KsiServiceError(`Invalid signing service credentials: ${signingServiceCredentials}`);
        }

        this.signingServiceProtocol = signingServiceProtocol;
        this.signingServiceCredentials = signingServiceCredentials;
    }

    private static processPayload(payload: AggregationResponsePayload | null): KsiSignature {
        if (!(payload instanceof AggregationResponsePayload)) {
            throw new KsiServiceError(`Invalid AggregationResponsePayload: ${payload}`);
        }

        if (payload.getStatus().neq(0))         {
            throw new KsiServiceError(`Server responded with error message.
                                       Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }

        return KsiSignature.CREATE(payload);
    }

    public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
        if (!(hash instanceof DataHash)) {
            throw new KsiServiceError(`Invalid hash: ${hash}`);
        }

        if (!bigInteger.isInstance(level)) {
            throw new KsiServiceError(`Invalid level: ${level}, must be BigInteger`);
        }

        const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.signingServiceCredentials.getLoginId());
        const requestId: BigInteger = pseudoRandomLong();
        const requestPayload: AggregationRequestPayload = AggregationRequestPayload.CREATE(requestId, hash, level);

        const requestPdu: AggregationRequestPdu = await AggregationRequestPdu.CREATE(header, requestPayload,
                                                                                     this.signingServiceCredentials.getHmacAlgorithm(),
                                                                                     this.signingServiceCredentials.getLoginKey());
        const ksiRequest: KsiRequest = new KsiRequest(requestPdu.encode());
        this.requests[requestId.toString()] = ksiRequest;
        const responseBytes: Uint8Array | null = await this.signingServiceProtocol.sign(ksiRequest);
        if (ksiRequest.getAbortSignal().aborted) {
            return SigningService.processPayload(<AggregationResponsePayload>ksiRequest.getResponsePdu());
        }

        const stream: TlvInputStream = new TlvInputStream(<Uint8Array>responseBytes);
        const responsePdu: AggregationResponsePdu = new AggregationResponsePdu(stream.readTag());
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

        let currentAggregationPayload: AggregationResponsePayload | null = null;
        for (const responsePayload of responsePdu.getPayloads()) {
            const aggregationPayload: AggregationResponsePayload = <AggregationResponsePayload>responsePayload;
            const payloadRequestId: string = aggregationPayload.getRequestId().toString();
            if (!this.requests.hasOwnProperty(payloadRequestId)) {
                throw new KsiServiceError('Aggregation response request ID does not match any request id which is sent!');
            }

            const request: KsiRequest = this.requests[payloadRequestId];
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

        return SigningService.processPayload(currentAggregationPayload);
    }
}
