import { TlvTag } from '../parser/TlvTag';
import { ErrorPayload } from './ErrorPayload';
/**
 * Extends Error payload TLV element.
 */
export declare class ExtendErrorPayload extends ErrorPayload {
    constructor(tlvTag: TlvTag);
}
