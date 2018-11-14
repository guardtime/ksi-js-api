import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration request payload.
 */
export class AggregatorConfigRequestPayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
}
