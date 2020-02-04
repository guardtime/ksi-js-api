import { BigInteger } from 'big-integer';
import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * PDU payload base class for responses
 */
export declare abstract class ResponsePayload extends PduPayload {
    private status;
    private errorMessage;
    protected constructor(tlvTag: TlvTag);
    getStatus(): BigInteger;
    getErrorMessage(): string | null;
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
