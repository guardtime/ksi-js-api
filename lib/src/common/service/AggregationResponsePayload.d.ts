import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { RequestResponsePayload } from './RequestResponsePayload';
/**
 * Aggregation response payload
 */
export declare class AggregationResponsePayload extends RequestResponsePayload {
    constructor(tlvTag: TlvTag);
    getSignatureTags(): TlvTag[];
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
