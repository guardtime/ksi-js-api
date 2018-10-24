import { ITlvCount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { Pdu } from './Pdu';
/**
 * Aggregation response PDU
 */
export declare class AggregationResponsePdu extends Pdu {
    private aggregatorConfigResponse;
    constructor(tlvTag: TlvTag);
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ITlvCount): void;
}
