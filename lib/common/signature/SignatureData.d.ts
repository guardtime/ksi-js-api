import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * Signature data TLV Object
 */
export declare class SignatureData extends CompositeTag {
    private certificateId;
    private certificateRepositoryUri;
    private signatureType;
    private signatureValue;
    constructor(tlvTag: TlvTag);
    getSignatureType(): string;
    getCertificateId(): Uint8Array;
    getSignatureValue(): Uint8Array;
    private parseChild;
    private validate;
}
