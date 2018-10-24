import bigInteger from 'big-integer';
import { DataHash, HashAlgorithm } from 'gt-js-common';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * RFC 3161 Record TLV Object
 */
export declare class Rfc3161Record extends CompositeTag {
    private aggregationTime;
    private chainIndexes;
    private inputHash;
    private tstInfoPrefix;
    private tstInfoSuffix;
    private tstInfoAlgorithm;
    private signedAttributesPrefix;
    private signedAttributesSuffix;
    private signedAttributesAlgorithm;
    constructor(tlvTag: TlvTag);
    getInputHash(): DataHash;
    getTstInfoAlgorithm(): HashAlgorithm;
    getSignedAttributesAlgorithm(): HashAlgorithm;
    getAggregationTime(): bigInteger.BigInteger;
    /**
     * Get chain index values
     */
    getChainIndex(): bigInteger.BigInteger[];
    getOutputHash(): Promise<DataHash>;
    private parseChild;
    private validate;
}
