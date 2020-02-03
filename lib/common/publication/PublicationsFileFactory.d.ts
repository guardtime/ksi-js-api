import { PublicationsFile } from './PublicationsFile';
/**
 * Publications file factory for publications file creation from byte array
 */
export declare class PublicationsFileFactory {
    private readonly trustedCertificates;
    private readonly signatueSubjectToVerify;
    constructor(trustedCertificates?: string, signatueSubjectToVerify?: string);
    create(publicationFileBytes: Uint8Array): PublicationsFile;
}
