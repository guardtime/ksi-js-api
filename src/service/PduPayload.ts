import {CompositeTag} from '../parser/CompositeTag';
import {TlvTag} from '../parser/TlvTag';

/**
 * Base class for PDU payloads
 */
export abstract class PduPayload extends CompositeTag {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

}
