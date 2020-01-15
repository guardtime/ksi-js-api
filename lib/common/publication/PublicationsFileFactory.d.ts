import { PublicationsFile } from './PublicationsFile';
/**
 * Publications file factory for publications file creation from byte array
 */
export declare class PublicationsFileFactory {
    private trustedCertificates;
    constructor(trustedCertificates?: string);
    create(publicationFileBytes: Uint8Array): PublicationsFile;
}
