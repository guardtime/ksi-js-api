import bigInteger from 'big-integer';
import {Base64Coder, DataHash} from 'gt-js-common';
import {
    AGGREGATION_HASH_CHAIN_CONSTANTS,
    CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
    CALENDAR_HASH_CHAIN_CONSTANTS,
    KSI_SIGNATURE_CONSTANTS, RFC_3161_RECORD_CONSTANTS
} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvInputStream} from '../parser/TlvInputStream';
import {TlvOutputStream} from '../parser/TlvOutputStream';
import {TlvTag} from '../parser/TlvTag';
import {PublicationRecord} from '../publication/PublicationRecord';
import {AggregationResponsePayload} from '../service/AggregationResponsePayload';
import {KsiError} from '../service/KsiError';
import {AggregationHashChain, AggregationHashResult} from './AggregationHashChain';
import {CalendarAuthenticationRecord} from './CalendarAuthenticationRecord';
import {CalendarHashChain} from './CalendarHashChain';
import {Rfc3161Record} from './Rfc3161Record';

/**
 * KSI Signature TLV object
 */
export class KsiSignature extends CompositeTag {
    private aggregationHashChains: AggregationHashChain[] = [];
    private publicationRecord: PublicationRecord | null = null;
    private calendarAuthenticationRecord: CalendarAuthenticationRecord | null = null;
    private calendarHashChain: CalendarHashChain | null = null;
    private rfc3161Record: Rfc3161Record | null = null;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE(payload: AggregationResponsePayload): KsiSignature {
        if (!(payload instanceof AggregationResponsePayload)) {
            throw new KsiError(`Invalid payload: ${payload}`);
        }

        return new KsiSignature(CompositeTag.CREATE_FROM_LIST(KSI_SIGNATURE_CONSTANTS.TagType, false, false,
                                                              payload.getSignatureTags()));
    }

    public static CREATE_FROM_BASE64(value: string): KsiSignature {
        if ((typeof value) !== 'string') {
            throw new KsiError(`Invalid value: ${value}`);
        }

        return new KsiSignature(new TlvInputStream(Base64Coder.decode(value)).readTag());
    }

    public getPublicationRecord(): PublicationRecord | null {
        return this.publicationRecord;
    }

    public getCalendarHashChain(): CalendarHashChain | null {
        return this.calendarHashChain;
    }

    public getAggregationTime(): bigInteger.BigInteger {
        return this.aggregationHashChains[0].getAggregationTime();
    }

    public getAggregationHashChains(): AggregationHashChain[] {
        return this.aggregationHashChains.slice();
    }

    /**
     * Get last aggregation hash chain output hash that is calculated from all aggregation hash chains
     */
    public async getLastAggregationHashChainRootHash(): Promise<DataHash> {
        let lastResult: AggregationHashResult = {level: bigInteger(0), hash: this.aggregationHashChains[0].getInputHash()};
        for (const chain of this.aggregationHashChains) {
            lastResult = await chain.getOutputHash(lastResult);
        }

        return lastResult.hash;
    }

    public getInputHash(): DataHash {
        return this.rfc3161Record !== null ? this.rfc3161Record.getInputHash() : this.aggregationHashChains[0].getInputHash();
    }

    public getRfc3161Record(): Rfc3161Record | null {
        return this.rfc3161Record;
    }

    public getCalendarAuthenticationRecord(): CalendarAuthenticationRecord | null {
        return this.calendarAuthenticationRecord;
    }

    public extend(calendarHashChain: CalendarHashChain, publicationRecord: PublicationRecord | null = null): KsiSignature {
        if (!(calendarHashChain instanceof CalendarHashChain)) {
            throw new KsiError(`Invalid calendar hash chain: ${calendarHashChain}`);
        }

        if (!(publicationRecord instanceof PublicationRecord)) {
            throw new KsiError(`Invalid publication record: ${publicationRecord}`);
        }

        const stream: TlvOutputStream = new TlvOutputStream();

        for (const childTag of this.value) {
            switch (childTag.id) {
                case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
                    break;
                default:
                    stream.writeTag(childTag);
            }
        }

        stream.writeTag(calendarHashChain);
        stream.writeTag(CompositeTag.createFromCompositeTag(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType, publicationRecord));

        return new KsiSignature(new TlvTag(KSI_SIGNATURE_CONSTANTS.TagType, false, false, stream.getData()));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
                const aggregationHashChain: AggregationHashChain = new AggregationHashChain(tlvTag);
                this.aggregationHashChains.push(aggregationHashChain);

                return aggregationHashChain;
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                return this.calendarHashChain = new CalendarHashChain(tlvTag);
            case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
                return this.publicationRecord = new PublicationRecord(tlvTag);
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
