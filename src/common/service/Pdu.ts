import {DataHash, HashAlgorithm, HMAC} from 'gt-js-common';
import {PDU_CONSTANTS, PDU_HEADER_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {TlvError} from '../parser/TlvError';
import {TlvInputStream} from '../parser/TlvInputStream';
import {TlvTag} from '../parser/TlvTag';
import {ErrorPayload} from './ErrorPayload';
import {PduHeader} from './PduHeader';
import {PduPayload} from './PduPayload';

/**
 * PDU base classs
 */
export abstract class Pdu extends CompositeTag {
    protected payloads: PduPayload[] = [];
    protected errorPayload: ErrorPayload | null = null;
    private header: PduHeader;
    private hmac: ImprintTag;

    protected constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

    protected static async create(tagType: number, header: PduHeader, payload: PduPayload, algorithm: HashAlgorithm,
                                  key: Uint8Array): Promise<TlvTag> {

        const pduBytes: Uint8Array = CompositeTag.CREATE_FROM_LIST(tagType, false, false, [
            header,
            payload,
            ImprintTag.CREATE(PDU_CONSTANTS.MacTagType, false, false, DataHash.create(algorithm, new Uint8Array(algorithm.length)))
        ]).encode();
        pduBytes.set(await HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length)), pduBytes.length - algorithm.length);

        return new TlvInputStream(pduBytes).readTag();
    }

    public getErrorPayload(): ErrorPayload | null {
        return this.errorPayload;
    }

    public getPayloads(): PduPayload[] {
        return this.payloads;
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.TagType:
                return this.header = new PduHeader(tlvTag);
            case PDU_CONSTANTS.MacTagType:
                return this.hmac = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        if (ErrorPayload != null) {
            return;
        }

        if (this.payloads.length === 0) {
            throw new TlvError('Payloads are missing in PDU.');
        }
        if (tagCount[PDU_HEADER_CONSTANTS.TagType] !== 1) {
            throw new TlvError('Exactly one header must exist in PDU.');
        }
        if (this.value[0] !== this.header) {
            throw new TlvError('Header must be the first element in PDU.');
        }
        if (tagCount[PDU_CONSTANTS.MacTagType] !== 1) {
            throw new TlvError('Exactly one MAC must exist in PDU');
        }
        if (this.value[this.value.length - 1] !== this.hmac) {
            throw new TlvError('MAC must be the last element in PDU');
        }
    }
}
