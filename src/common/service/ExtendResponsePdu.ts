import {
    AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS,
    ERROR_PAYLOAD_CONSTANTS, EXTEND_RESPONSE_PAYLOAD_CONSTANTS, EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS
} from '../Constants';
import {ICount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {ExtenderConfigResponsePayload} from './ExtenderConfigResponsePayload';
import {ExtendErrorPayload} from './ExtendErrorPayload';
import {ExtendResponsePayload} from './ExtendResponsePayload';
import {Pdu} from './Pdu';

/**
 * Extend response PDU
 */
export class ExtendResponsePdu extends Pdu {
    private extenderConfigResponse: ExtenderConfigResponsePayload;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                const extendResponsePayload: ExtendResponsePayload = new ExtendResponsePayload(tlvTag);
                this.payloads.push(extendResponsePayload);

                return extendResponsePayload;
            case ERROR_PAYLOAD_CONSTANTS.TagType:
                return this.errorPayload = new ExtendErrorPayload(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return this.extenderConfigResponse = new ExtenderConfigResponsePayload(tlvTag);
            // not implemented yet, so just return the tag
            case AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ICount): void {
        super.validate(tagCount);

        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one extender config response payload is allowed in PDU.');
        }
    }
}
