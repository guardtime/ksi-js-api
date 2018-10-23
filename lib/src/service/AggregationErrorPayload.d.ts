import { TlvTag } from '../parser/TlvTag';
import { ErrorPayload } from './ErrorPayload';
/**
 * Aggregation Error payload TLV element.
 */
export declare class AggregationErrorPayload extends ErrorPayload {
    constructor(tlvTag: TlvTag);
}
