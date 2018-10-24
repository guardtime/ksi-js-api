import {TlvTag} from '../parser/TlvTag';
import {ErrorPayload} from './ErrorPayload';

/**
 * Extends Error payload TLV element.
 */
export class ExtendErrorPayload extends ErrorPayload {
    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }
}
