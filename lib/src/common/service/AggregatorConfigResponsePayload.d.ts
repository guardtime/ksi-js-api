import { ITlvCount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration response payload.
 */
export declare class AggregatorConfigResponsePayload extends PduPayload {
    private aggregationPeriod;
    private aggregationAlgorithm;
    private maxLevel;
    private maxRequests;
    private parentUriList;
    constructor(tlvTag: TlvTag);
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ITlvCount): void;
}
