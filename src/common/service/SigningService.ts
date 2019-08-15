import {DataHash, pseudoRandomLong} from '@guardtime/gt-js-common';
import bigInteger, {BigInteger} from 'big-integer';
import {TlvInputStream} from '../parser/TlvInputStream';
import {KsiSignature} from '../signature/KsiSignature';
import {AggregationRequestPayload} from './AggregationRequestPayload';
import {AggregationRequestPdu} from './AggregationRequestPdu';
import {AggregationResponsePayload} from './AggregationResponsePayload';
import {AggregationResponsePdu} from './AggregationResponsePdu';
import {ErrorPayload} from './ErrorPayload';
import {IServiceCredentials} from './IServiceCredentials';
import {ISigningServiceProtocol} from './ISigningServiceProtocol';
import {KsiRequestBase} from './KsiRequestBase';
import {KsiServiceError} from './KsiServiceError';
import {PduHeader} from './PduHeader';

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
        if (payload.getStatus().neq(0))         {
            // tslint:disable-next-line:max-line-length
            throw new KsiServiceError(`Server responded with error message. Status: ${payload.getStatus()}; Message: ${payload.getErrorMessage()}.`);
        }

        return KsiSignature.CREATE(payload);
    }

    public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
        const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.signingServiceCredentials.getLoginId());
        const requestId: BigInteger = this.generateRequestId();
        const requestPayload: AggregationRequestPayload = AggregationRequestPayload.CREATE(requestId, hash, level);

        const requestPdu: AggregationRequestPdu = await AggregationRequestPdu.CREATE(header, requestPayload,
                                                                                     this.signingServiceCredentials.getHmacAlgorithm(),
                                                                                     this.signingServiceCredentials.getLoginKey());

        const ksiRequest: KsiRequestBase = this.signingServiceProtocol.sign(requestPdu.encode());
        this.requests[requestId.toString()] = ksiRequest;
        const responseBytes: Uint8Array | null = await ksiRequest.getResponse();
        if (ksiRequest.isAborted()) {
            return SigningService.processPayload(<AggregationResponsePayload>ksiRequest.getAbortResponse());
        }

        const stream: TlvInputStream = new TlvInputStream(<Uint8Array>responseBytes);
        const responsePdu: AggregationResponsePdu = new AggregationResponsePdu(stream.readTag());
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

        let currentAggregationPayload: AggregationResponsePayload | null = null;
        for (const responsePayload of responsePdu.getPayloads()) {
            const aggregationPayload: AggregationResponsePayload = <AggregationResponsePayload>responsePayload;
            const payloadRequestId: string = aggregationPayload.getRequestId().toString();
            if (!this.requests.hasOwnProperty(payloadRequestId)) {
                throw new KsiServiceError('Aggregation response request ID does not match any request id which is sent.');
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
