import { DataHash, HashAlgorithm } from '@guardtime/gt-js-common';
import { BigInteger } from 'big-integer';
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
    getAggregationTime(): BigInteger;
    /**
     * Get chain index values
     */
    getChainIndex(): BigInteger[];
    getOutputHash(): Promise<DataHash>;
    private parseChild;
    private validate;
}
