import {
    AGGREGATION_HASH_CHAIN_CONSTANTS,
    CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
    CALENDAR_HASH_CHAIN_CONSTANTS,
    KSI_SIGNATURE_CONSTANTS,
    RFC_3161_RECORD_CONSTANTS
} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PublicationRecord} from '../publication/PublicationRecord';
import {AggregationHashChain} from './AggregationHashChain';
import {CalendarAuthenticationRecord} from './CalendarAuthenticationRecord';
import {CalendarHashChain} from './CalendarHashChain';
import {Rfc3161Record} from './Rfc3161Record';

/**
 * KSI Signature TLV object
 */
export class KsiSignature extends CompositeTag {
    private aggregationHashChains: AggregationHashChain[] = [];
    private publicationRecord: PublicationRecord;
    private calendarAuthenticationRecord: CalendarAuthenticationRecord;
    private calendarHashChain: CalendarHashChain;
    private rfc3161Record: Rfc3161Record;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
                const aggregationHashChain: AggregationHashChain = new AggregationHashChain(tlvTag);
                this.aggregationHashChains.push(aggregationHashChain);

                return aggregationHashChain;
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                return this.calendarHashChain = new CalendarHashChain(tlvTag) ;
            case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
                return this.publicationRecord = new PublicationRecord(tlvTag) ;
            case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                return this.calendarAuthenticationRecord = new CalendarAuthenticationRecord(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TagType:
                return this.rfc3161Record = new Rfc3161Record(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (this.aggregationHashChains.length === 0) {
            throw new TlvError('Aggregation hash chains must exist in KSI signature.');
        }

        if (tagCount[CALENDAR_HASH_CHAIN_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one calendar hash chain is allowed in KSI signature.');
        }

        if (tagCount[CALENDAR_HASH_CHAIN_CONSTANTS.TagType] === 0 && (tagCount[KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType] !== 0 ||
                tagCount[CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType] !== 0)) {
            throw new TlvError('No publication record or calendar authentication record is ' +
                'allowed in KSI signature if there is no calendar hash chain.');
        }

        if ((tagCount[KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType] === 1 &&
                tagCount[CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType] === 1) ||
            tagCount[KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType] > 1 ||
            tagCount[CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one from publication record or calendar authentication record is allowed in KSI signature.');
        }

        if (tagCount[RFC_3161_RECORD_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one RFC 3161 record is allowed in KSI signature.');
        }
    }
}
