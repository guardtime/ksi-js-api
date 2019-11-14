import { CompositeTag } from '../parser/CompositeTag';
/**
 * Base class for PDU payloads
 */
export class PduPayload extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
    }
}
