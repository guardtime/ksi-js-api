import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';

/**
 * Extender configuration request payload.
 */
export class ExtenderConfigRequestPayload extends PduPayload {
    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

}
