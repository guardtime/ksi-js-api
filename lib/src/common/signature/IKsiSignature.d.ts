import { BigInteger } from 'big-integer';
import { DataHash } from '../main';
import { PublicationRecord } from '../publication/PublicationRecord';
import { AggregationHashChain } from './AggregationHashChain';
import { CalendarAuthenticationRecord } from './CalendarAuthenticationRecord';
import { CalendarHashChain } from './CalendarHashChain';
import { IKsiIdentity } from './IKsiIdentity';
import { Rfc3161Record } from './Rfc3161Record';
/**
 * KsiSignature interface
 */
export interface IKsiSignature {
    getAggregationHashChains(): AggregationHashChain[];
    getPublicationRecord(): PublicationRecord | null;
    getCalendarAuthenticationRecord(): CalendarAuthenticationRecord | null;
    getCalendarHashChain(): CalendarHashChain | null;
    getAggregationTime(): BigInteger;
    getRfc3161Record(): Rfc3161Record | null;
    getLastAggregationHashChainRootHash(): Promise<DataHash>;
    getInputHash(): DataHash;
    getIdentity(): IKsiIdentity[];
    isExtended(): boolean;
    extend(calendarHashChain: CalendarHashChain, publicationRecord: PublicationRecord | null): IKsiSignature;
}
export declare function isKsiSignature(object: any): object is IKsiSignature;
