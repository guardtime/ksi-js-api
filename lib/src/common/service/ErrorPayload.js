import { ResponsePayload } from './ResponsePayload';
/**
 * KSI service error response payload.
 */
export class ErrorPayload extends ResponsePayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
}
