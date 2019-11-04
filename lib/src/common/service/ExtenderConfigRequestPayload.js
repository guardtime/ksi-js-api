import { PduPayload } from './PduPayload';
/**
 * Extender configuration request payload.
 */
export class ExtenderConfigRequestPayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
}
