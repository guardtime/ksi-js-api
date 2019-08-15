import {HashAlgorithm} from '@guardtime/gt-js-common';
import {EXTEND_REQUEST_PAYLOAD_CONSTANTS, EXTEND_REQUEST_PDU_CONSTANTS, EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS} from '../Constants';
import {ICount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {ExtenderConfigRequestPayload} from './ExtenderConfigRequestPayload';
import {ExtendRequestPayload} from './ExtendRequestPayload';
import {Pdu} from './Pdu';
import {PduHeader} from './PduHeader';

/**
 * Extend request PDU
 */
export class ExtendRequestPdu extends Pdu {
    private extenderConfigRequest: ExtenderConfigRequestPayload;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static async CREATE(header: PduHeader, payload: ExtendRequestPayload,
                               algorithm: HashAlgorithm, key: Uint8Array): Promise<ExtendRequestPdu> {
        return new ExtendRequestPdu(await Pdu.create(EXTEND_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key));
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const extendRequestPayload: ExtendRequestPayload = new ExtendRequestPayload(tlvTag);
                this.payloads.push(extendRequestPayload);

                return extendRequestPayload;
            case EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                return this.extenderConfigRequest = new ExtenderConfigRequestPayload(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ICount): void {
        super.validate(tagCount);

        if (tagCount.getCount(EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one extender config request payload is allowed in PDU.');
        }
    }
}
