import { CALENDAR_HASH_CHAIN_CONSTANTS, EXTEND_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { RequestResponsePayload } from './RequestResponsePayload';
/**
 * Extend response payload
 */
export class ExtendResponsePayload extends RequestResponsePayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getCalendarHashChain() {
        return this.calendarHashChain;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
                return this.calendarLastTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                return this.calendarHashChain = new CalendarHashChain(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount.getCount(EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
            throw new TlvError('Only one calendar last time is allowed in extend response payload.');
        }
        if (this.getStatus().eq(0) && tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one calendar hash chain must exist in extend response payload.');
        }
    }
}
