var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bigInteger from 'big-integer';
import { Base64Coder } from 'gt-js-common';
import { AGGREGATION_HASH_CHAIN_CONSTANTS, CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, CALENDAR_HASH_CHAIN_CONSTANTS, KSI_SIGNATURE_CONSTANTS, RFC_3161_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { TlvOutputStream } from '../parser/TlvOutputStream';
import { TlvTag } from '../parser/TlvTag';
import { PublicationRecord } from '../publication/PublicationRecord';
import { AggregationResponsePayload } from '../service/AggregationResponsePayload';
import { KsiError } from '../service/KsiError';
import { AggregationHashChain } from './AggregationHashChain';
import { CalendarAuthenticationRecord } from './CalendarAuthenticationRecord';
import { CalendarHashChain } from './CalendarHashChain';
import { Rfc3161Record } from './Rfc3161Record';
/**
 * KSI Signature TLV object
 */
export class KsiSignature extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.aggregationHashChains = [];
        this.publicationRecord = null;
        this.calendarAuthenticationRecord = null;
        this.calendarHashChain = null;
        this.rfc3161Record = null;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(payload) {
        if (!(payload instanceof AggregationResponsePayload)) {
            throw new KsiError(`Invalid payload: ${payload}`);
        }
        return new KsiSignature(CompositeTag.CREATE_FROM_LIST(KSI_SIGNATURE_CONSTANTS.TagType, false, false, payload.getSignatureTags()));
    }
    static CREATE_FROM_BASE64(value) {
        if ((typeof value) !== 'string') {
            throw new KsiError(`Invalid value: ${value}`);
        }
        return new KsiSignature(new TlvInputStream(Base64Coder.decode(value)).readTag());
    }
    getPublicationRecord() {
        return this.publicationRecord;
    }
    getCalendarHashChain() {
        return this.calendarHashChain;
    }
    getAggregationTime() {
        return this.aggregationHashChains[0].getAggregationTime();
    }
    getAggregationHashChains() {
        return this.aggregationHashChains.slice();
    }
    /**
     * Get last aggregation hash chain output hash that is calculated from all aggregation hash chains
     */
    getLastAggregationHashChainRootHash() {
        return __awaiter(this, void 0, void 0, function* () {
            let lastResult = { level: bigInteger(0), hash: this.aggregationHashChains[0].getInputHash() };
            for (const chain of this.aggregationHashChains) {
                lastResult = yield chain.getOutputHash(lastResult);
            }
            return lastResult.hash;
        });
    }
    getInputHash() {
        return this.rfc3161Record !== null ? this.rfc3161Record.getInputHash() : this.aggregationHashChains[0].getInputHash();
    }
    getRfc3161Record() {
        return this.rfc3161Record;
    }
    getCalendarAuthenticationRecord() {
        return this.calendarAuthenticationRecord;
    }
    extend(calendarHashChain, publicationRecord = null) {
        if (!(calendarHashChain instanceof CalendarHashChain)) {
            throw new KsiError(`Invalid calendar hash chain: ${calendarHashChain}`);
        }
        if (!(publicationRecord instanceof PublicationRecord)) {
            throw new KsiError(`Invalid publication record: ${publicationRecord}`);
        }
        const stream = new TlvOutputStream();
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
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
                const aggregationHashChain = new AggregationHashChain(tlvTag);
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
    validate(tagCount) {
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
