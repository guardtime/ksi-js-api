import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * Certificate Record TLV object
 */
export declare class CertificateRecord extends CompositeTag {
    private certificateId;
    private x509Certificate;
    constructor(tlvTag: TlvTag);
    getX509Certificate(): Uint8Array;
    getCertificateId(): Uint8Array;
    private parseChild;
    private validate;
}
