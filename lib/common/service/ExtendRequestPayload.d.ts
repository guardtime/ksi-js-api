import { BigInteger } from 'big-integer';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * Aggregation request payload
 */
export declare class ExtendRequestPayload extends PduPayload {
    private requestId;
    private aggregationTime;
    private publicationTime;
    constructor(tlvTag: TlvTag);
    static CREATE(requestId: BigInteger, aggregationTime: BigInteger, publicationTime?: BigInteger | null): ExtendRequestPayload;
    private parseChild;
    private validate;
}
