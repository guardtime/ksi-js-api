import { BigInteger } from 'big-integer';
import { DataHash, HashAlgorithm } from 'gt-js-common';
import { LinkDirection } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { TlvTag } from '../parser/TlvTag';
import { IKsiIdentity } from './IKsiIdentity';
/**
 * Aggregation Hash Chain Link Metadata TLV Object
 */
export declare class AggregationHashChainLinkMetaData extends CompositeTag implements IKsiIdentity {
    private padding;
    private clientId;
    private machineId;
    private sequenceNumber;
    private requestTime;
    constructor(tlvTag: TlvTag);
    getClientId(): string;
    getMachineId(): string | null;
    getSequenceNumber(): BigInteger | null;
    getRequestTime(): BigInteger | null;
    getPaddingTag(): RawTag | null;
    private parseChild;
    private validate;
}
/**
 * Aggregation Hash Chain Link TLV Object
 */
export declare class AggregationHashChainLink extends CompositeTag {
    private static readonly LEGACY_ID_FIRST_OCTET;
    private static readonly LEGACY_ID_LENGTH;
    private readonly direction;
    private levelCorrection;
    private siblingHash;
    private legacyId;
    private legacyIdString;
    private metadata;
    constructor(tlvTag: TlvTag);
    private static getLegacyIdString;
    getLevelCorrection(): BigInteger;
    getMetadata(): AggregationHashChainLinkMetaData | null;
    getDirection(): LinkDirection;
    getSiblingData(): Uint8Array;
    getIdentity(): IKsiIdentity | null;
    private parseChild;
    private validate;
}
export declare type AggregationHashResult = Readonly<{
    level: BigInteger;
    hash: DataHash;
}>;
/**
 * Aggregation Hash Chain TLV Object
 */
export declare class AggregationHashChain extends CompositeTag {
    private chainIndexes;
    private aggregationTime;
    private chainLinks;
    private aggregationAlgorithm;
    private inputHash;
    private inputData;
    constructor(tlvTag: TlvTag);
    getChainLinks(): AggregationHashChainLink[];
    /**
     * Get chain index values
     */
    getChainIndex(): BigInteger[];
    getAggregationTime(): BigInteger;
    getAggregationAlgorithm(): HashAlgorithm;
    getIdentity(): IKsiIdentity[];
    getOutputHash(result: AggregationHashResult): Promise<AggregationHashResult>;
    getInputHash(): DataHash;
    getInputData(): Uint8Array | null;
    /**
     * Returns location pointer based on aggregation hash chain links
     */
    calculateLocationPointer(): BigInteger;
    private getStepHash;
    private parseChild;
    private validate;
}
