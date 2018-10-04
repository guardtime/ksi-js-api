import {CertificateRecord} from 'src/publication/CertificateRecord';
import {PublicationRecord} from 'src/publication/PublicationRecord';

/**
 * Publications File interface for functionality
 */
export interface IPublicationsFile {
    getNearestPublicationRecord(unixTime: number): PublicationRecord | null;
    getLatestPublication(): PublicationRecord | null;
    findCertificateById(certificateId: Uint8Array): CertificateRecord | null;
}
