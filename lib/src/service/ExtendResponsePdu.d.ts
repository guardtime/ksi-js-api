import { ITlvCount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { Pdu } from './Pdu';
/**
 * Extend response PDU
 */
export declare class ExtendResponsePdu extends Pdu {
    private extenderConfigResponse;
    constructor(tlvTag: TlvTag);
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ITlvCount): void;
}
