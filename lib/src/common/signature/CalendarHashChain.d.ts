import bigInteger, { BigInteger } from 'big-integer';
import { DataHash } from '@guardtime/gt-js-common';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from '../publication/PublicationData';
/**
 * Calendar Hash Chain TLV Object
 */
export declare class CalendarHashChain extends CompositeTag {
    private chainLinks;
    private publicationTime;
    private aggregationTime;
    private inputHash;
    constructor(tlvTag: TlvTag);
    /**
     * Calculate highest bit.
     */
    private static highBit;
    /**
     * Hash two hashes together with algorithm.
     */
    private static getStepHash;
    /**
     * Compare right links if they are equal.
     */
    areRightLinksEqual(calendarHashChain: CalendarHashChain): boolean;
    calculateRegistrationTime(): BigInteger;
    getChainLinks(): ImprintTag[];
    getPublicationTime(): bigInteger.BigInteger;
    getInputHash(): DataHash;
    getAggregationTime(): bigInteger.BigInteger;
    /**
     * Calculate output hash.
     */
    calculateOutputHash(): Promise<DataHash>;
    getPublicationData(): Promise<PublicationData>;
    private parseChild;
    private validate;
}
