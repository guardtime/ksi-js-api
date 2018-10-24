import {
    AGGREGATION_HASH_CHAIN_CONSTANTS,
    CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
    CALENDAR_HASH_CHAIN_CONSTANTS, EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS,
    KSI_SIGNATURE_CONSTANTS
} from '../Constants';
import {ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {RequestResponsePayload} from './RequestResponsePayload';

/**
 * Aggregation response payload
 */
export class AggregationResponsePayload extends RequestResponsePayload {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));

        Object.freeze(this);
    }

    public getSignatureTags(): TlvTag[] {
        const tlvList: TlvTag[] = [];
        for (const tlvTag of this.value) {
            if (tlvTag.id > 0x800 && tlvTag.id < 0x900) {
                tlvList.push(tlvTag);
            }
        }

        return tlvList;
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
            case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
            case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        super.validate(tagCount);

        if (tagCount[EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one extender config request payload is allowed in PDU.');
        }
    }
}
