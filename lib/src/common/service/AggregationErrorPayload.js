import { ErrorPayload } from './ErrorPayload';
/**
 * Aggregation Error payload TLV element.
 */
export class AggregationErrorPayload extends ErrorPayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
}
