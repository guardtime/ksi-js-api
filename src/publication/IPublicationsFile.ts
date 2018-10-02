import CertificateRecord from "./CertificateRecord";
import PublicationRecord from "./PublicationRecord";

export default interface IPublicationsFile {
    getNearestPublicationRecord(unixTime: number): PublicationRecord | null;
    getLatestPublication(): PublicationRecord | null;
    findCertificateById(certificateId: Uint8Array): CertificateRecord | null;
}
