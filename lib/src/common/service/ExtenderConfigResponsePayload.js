import { EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration response payload.
 */
export class ExtenderConfigResponsePayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.parentUriList = [];
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
                return this.maxRequests = new IntegerTag(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
                const uriTag = new StringTag(tlvTag);
                this.parentUriList.push(uriTag);
                return uriTag;
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType:
                return this.calendarFirstTime = new IntegerTag(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
                return this.calendarLastTime = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType) > 1) {
            throw new TlvError('Only one max requests tag is allowed in extender config response payload.');
        }
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType) > 1) {
            throw new TlvError('Only one calendar first time tag is allowed in extender config response payload.');
        }
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
            throw new TlvError('Only one calendar last time tag is allowed in extender config response payload.');
        }
    }
}
