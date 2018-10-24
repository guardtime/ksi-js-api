import {EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';

/**
 * Aggregator configuration response payload.
 */
export class ExtenderConfigResponsePayload extends PduPayload {
    private maxRequests: IntegerTag;
    private parentUriList: StringTag[] = [];
    private calendarFirstTime: IntegerTag;
    private calendarLastTime: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
                return this.maxRequests = new IntegerTag(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
                const uriTag: StringTag = new StringTag(tlvTag);
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

    protected validate(tagCount: ITlvCount): void {
        if (tagCount[EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType] > 1) {
            throw new TlvError('Only one max requests tag is allowed in extender config response payload.');
        }

        if (tagCount[EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType] > 1) {
            throw new TlvError('Only one calendar first time tag is allowed in extender config response payload.');
        }

        if (tagCount[EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType] > 1) {
            throw new TlvError('Only one calendar last time tag is allowed in extender config response payload.');
        }
    }
}
