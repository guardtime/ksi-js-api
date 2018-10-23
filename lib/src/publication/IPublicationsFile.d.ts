import { BigInteger } from 'big-integer';
import { CertificateRecord } from './CertificateRecord';
import { PublicationRecord } from './PublicationRecord';
/**
 * Publications File interface for functionality
 */
export interface IPublicationsFile {
    getNearestPublicationRecord(unixTime: BigInteger): PublicationRecord | null;
    getLatestPublication(): PublicationRecord | null;
    findCertificateById(certificateId: Uint8Array): CertificateRecord | null;
}
