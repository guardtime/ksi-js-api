import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';

/**
 * Aggregator configuration request payload.
 */
export class AggregatorConfigRequestPayload extends PduPayload {
    public constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }
}
