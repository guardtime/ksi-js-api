import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * Extender configuration request payload.
 */
export declare class ExtenderConfigRequestPayload extends PduPayload {
    constructor(tlvTag: TlvTag);
}
