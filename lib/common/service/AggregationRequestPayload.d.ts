import { DataHash } from '@guardtime/gt-js-common';
import { BigInteger } from 'big-integer';
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
