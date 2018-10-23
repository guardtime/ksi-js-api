import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * Aggregation request payload
 */
export declare class AggregationRequestPayload extends CompositeTag {
    private requestId;
    private requestHash;
    private requestLevel;
    constructor(tlvTag: TlvTag);
    static CREATE(requestId: BigInteger, hash: DataHash, level?: BigInteger): AggregationRequestPayload;
    private parseChild;
    private validate;
}
