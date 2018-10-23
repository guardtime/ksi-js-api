import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * Base class for PDU payloads
 */
export declare abstract class PduPayload extends CompositeTag {
    protected constructor(tlvTag: TlvTag);
}
