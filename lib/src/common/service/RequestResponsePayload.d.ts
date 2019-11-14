import { BigInteger } from 'big-integer';
import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { ResponsePayload } from './ResponsePayload';
/**
 * PDU payload base class for requested responses
 */
export declare abstract class RequestResponsePayload extends ResponsePayload {
    private requestId;
    protected constructor(tlvTag: TlvTag);
    getRequestId(): BigInteger;
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
