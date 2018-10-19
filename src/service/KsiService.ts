import bigInteger, {BigInteger} from 'big-integer';
import {DataHash, pseudoRandomLong} from 'gt-js-common';
import {TlvInputStream} from '../parser/TlvInputStream';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {KsiSignature} from '../signature/KsiSignature';
import {AggregationRequestPayload} from './AggregationRequestPayload';
import {AggregationRequestPdu} from './AggregationRequestPdu';
import {AggregationResponsePdu} from './AggregationResponsePdu';
import {IServiceCredentials} from './IServiceCredentials';
import {KsiServiceError} from './KsiServiceError';
import {PduHeader} from './PduHeader';
import {SigningServiceProtocol} from './SigningServiceProtocol';
import {AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS, AGGREGATION_RESPONSE_PDU_CONSTANTS} from '../Constants';
import {PduPayload} from './PduPayload';
import {AggregationResponsePayload} from './AggregationResponsePayload';

/**
 * KSI service.
 */
export class KsiService {

    private signingServiceProtocol: SigningServiceProtocol;
    private signingServiceCredentials: IServiceCredentials;
    // private extendingServiceProtocol: ExtendingServiceProtocol;
    private extendingServiceCredentials: IServiceCredentials;
    // private publicationsFileServiceProtocol: PublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(signingServiceProtocol: SigningServiceProtocol, signingServiceCredentials: IServiceCredentials) {
        // extendingServiceProtocol: ExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials,
        // publicationsFileServiceProtocol: PublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        this.signingServiceProtocol = signingServiceProtocol;
        this.signingServiceCredentials = signingServiceCredentials;
        // this.extendingServiceProtocol = extendingServiceProtocol;
        // this.extendingServiceCredentials = extendingServiceCredentials;
        // this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
        // this.publicationsFileFactory = publicationsFileFactory;
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
        const responseBytes: Uint8Array = await this.signingServiceProtocol.sign(requestPdu.encode());
        const stream: TlvInputStream = new TlvInputStream(responseBytes);
        const responsePdu: AggregationResponsePdu = new AggregationResponsePdu(stream.readTag());
        for (const responsePayload of responsePdu.getPayloads()) {
            if (responsePayload.id === AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS.TagType) {
                return KsiSignature.CREATE(<AggregationResponsePayload>responsePayload);
            }
        }

        throw new KsiServiceError('No valid payload found');
    }

}
