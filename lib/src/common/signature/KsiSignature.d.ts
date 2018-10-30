import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PublicationRecord } from '../publication/PublicationRecord';
import { AggregationResponsePayload } from '../service/AggregationResponsePayload';
import { AggregationHashChain } from './AggregationHashChain';
import { CalendarAuthenticationRecord } from './CalendarAuthenticationRecord';
import { CalendarHashChain } from './CalendarHashChain';
import { IKsiIdentity } from './IKsiIdentity';
import { IKsiSignature } from './IKsiSignature';
import { Rfc3161Record } from './Rfc3161Record';
/**
 * KSI Signature TLV object
 */
export declare class KsiSignature extends CompositeTag implements IKsiSignature {
    private aggregationHashChains;
    private publicationRecord;
    private calendarAuthenticationRecord;
    private calendarHashChain;
    private rfc3161Record;
    constructor(tlvTag: TlvTag);
    static CREATE(payload: AggregationResponsePayload): IKsiSignature;
    static CREATE_FROM_BASE64(value: string): IKsiSignature;
    getPublicationRecord(): PublicationRecord | null;
    getCalendarHashChain(): CalendarHashChain | null;
    getAggregationTime(): BigInteger;
    getAggregationHashChains(): AggregationHashChain[];
    /**
     * Get last aggregation hash chain output hash that is calculated from all aggregation hash chains
     */
    getLastAggregationHashChainRootHash(): Promise<DataHash>;
    getInputHash(): DataHash;
    getRfc3161Record(): Rfc3161Record | null;
    getCalendarAuthenticationRecord(): CalendarAuthenticationRecord | null;
    getIdentity(): IKsiIdentity[];
    isExtended(): boolean;
    extend(calendarHashChain: CalendarHashChain, publicationRecord?: PublicationRecord | null): IKsiSignature;
    private parseChild;
    private validate;
}
