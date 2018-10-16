import {CALENDAR_HASH_CHAIN_CONSTANTS, LINK_DIRECTION_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Calendar Hash Chain TLV Object
 */
export class CalendarHashChain extends CompositeTag {

    private chainLinks: ImprintTag[] = [];
    private publicationTime: IntegerTag;
    private aggregationTime: IntegerTag;
    private inputHash: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case LINK_DIRECTION_CONSTANTS.Left:
            case LINK_DIRECTION_CONSTANTS.Right:
                const link: ImprintTag = new ImprintTag(tlvTag);
                this.chainLinks.push(link);

                return link;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType] !== 1) {
            throw new TlvError('Exactly one publication time must exist in calendar hash chain.');
        }

        if (tagCount[CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType] > 1) {
            throw new TlvError('Only one aggregation time is allowed in calendar hash chain.');
        }

        if (tagCount[CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType] !== 1) {
            throw new TlvError('Exactly one input hash must exist in calendar hash chain.');
        }

        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in calendar hash chain.');
        }
    }
}
