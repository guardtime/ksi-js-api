import {DataHash, HashAlgorithm, HMAC} from 'gt-js-common';
import {PDU_CONSTANTS, PDU_HEADER_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {TlvError} from '../parser/TlvError';
import {TlvInputStream} from '../parser/TlvInputStream';
import {TlvTag} from '../parser/TlvTag';
import {PduHeader} from './PduHeader';
import {PduPayload} from './PduPayload';

/**
 * PDU base classs
 */
export abstract class Pdu extends CompositeTag {
    protected payloads: PduPayload[] = [];
    private header: PduHeader;
    private hmac: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

    // TODO: Change TLVTag to PduPayload
    public static async CREATE_PDU(tagType: number, header: PduHeader, payload: TlvTag, algorithm: HashAlgorithm,
                                   key: Uint8Array): Promise<TlvTag> {

        const pduBytes: Uint8Array = CompositeTag.createCompositeTagTlv(tagType, false, false, [
            header,
            payload,
            ImprintTag.CREATE(PDU_CONSTANTS.MacTagType, false, false, DataHash.create(algorithm, new Uint8Array(algorithm.length)))
        ]).encode();
        pduBytes.set(await HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length)), pduBytes.length - algorithm.length);

        return new TlvInputStream(pduBytes).readTag();
    }

    public getPayloads(): PduPayload[] {
        return this.payloads;
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.TagType:
                // _headerIndex = Count;
                return this.header = new PduHeader(tlvTag);
            case PDU_CONSTANTS.MacTagType:
                // _macIndex = Count;
                return this.hmac = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        if (tagCount[PDU_HEADER_CONSTANTS.LoginIdTagType] !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.InstanceIdTagType] > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.MessageIdTagType] > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }
}
