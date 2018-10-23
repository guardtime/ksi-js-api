import { HashAlgorithm } from 'gt-js-common';
import { CompositeTag, ITlvCount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { ErrorPayload } from './ErrorPayload';
import { PduHeader } from './PduHeader';
import { PduPayload } from './PduPayload';
/**
 * PDU base classs
 */
export declare abstract class Pdu extends CompositeTag {
    protected payloads: PduPayload[];
    protected errorPayload: ErrorPayload | null;
    private header;
    private hmac;
    protected constructor(tlvTag: TlvTag);
    protected static create(tagType: number, header: PduHeader, payload: PduPayload, algorithm: HashAlgorithm, key: Uint8Array): Promise<TlvTag>;
    getErrorPayload(): ErrorPayload | null;
    getPayloads(): PduPayload[];
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ITlvCount): void;
}
