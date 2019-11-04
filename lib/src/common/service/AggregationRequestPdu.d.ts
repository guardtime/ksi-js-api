import { HashAlgorithm } from '@guardtime/gt-js-common';
import { ICount } from '../parser/CompositeTag';
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
    protected validate(tagCount: ICount): void;
}
