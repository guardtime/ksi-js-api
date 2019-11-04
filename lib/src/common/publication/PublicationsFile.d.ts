import { BigInteger } from 'big-integer';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { CertificateRecord } from './CertificateRecord';
import { PublicationRecord } from './PublicationRecord';
/**
 * Publications File TLV object
 */
export declare class PublicationsFile extends CompositeTag {
    static readonly FileBeginningMagicBytes: Uint8Array;
    private readonly certificateRecordList;
    private cmsSignature;
    private readonly publicationRecordList;
    private publicationsFileHeader;
    private headerIndex;
    private lastCertificateRecordIndex;
    private firstPublicationRecordIndex;
    private cmsSignatureIndex;
    constructor(tlvTag: TlvTag);
    findCertificateById(certificateId: Uint8Array): CertificateRecord | null;
    getLatestPublication(): PublicationRecord | null;
    getNearestPublicationRecord(unixTime: BigInteger): PublicationRecord | null;
    getSignatureValue(): Uint8Array;
    getSignedBytes(): Uint8Array;
    private parseChild;
    private validate;
}
