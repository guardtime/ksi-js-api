import { TlvTag } from '../parser/TlvTag';
import { ResponsePayload } from './ResponsePayload';
/**
 * KSI service error response payload.
 */
export declare abstract class ErrorPayload extends ResponsePayload {
    protected constructor(tlvTag: TlvTag);
}