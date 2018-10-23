import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration request payload.
 */
export declare class AggregatorConfigRequestPayload extends PduPayload {
    constructor(tlvTag: TlvTag);
}
