import { HashAlgorithm } from 'gt-js-common';
import { ITlvCount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { AggregationRequestPayload } from './AggregationRequestPayload';
import { Pdu } from './Pdu';
import { PduHeader } from './PduHeader';
/**
 * Aggregation request PDU
 */
export declare class AggregationRequestPdu extends Pdu {
    private aggregatorConfigRequest;
    constructor(tlvTag: TlvTag);
    static CREATE(header: PduHeader, payload: AggregationRequestPayload, algorithm: HashAlgorithm, key: Uint8Array): Promise<AggregationRequestPdu>;
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ITlvCount): void;
}