import {
    AGGREGATION_HASH_CHAIN_CONSTANTS,
    CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
    CALENDAR_HASH_CHAIN_CONSTANTS,
    KSI_SIGNATURE_CONSTANTS
} from '../Constants';
import {CompositeTag} from '../parser/CompositeTag';
import {TlvTag} from '../parser/TlvTag';
import {ResponsePayload} from './ResponsePayload';
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
}
