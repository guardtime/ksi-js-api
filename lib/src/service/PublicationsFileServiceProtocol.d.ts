/**
 * HTTP publications file service protocol
 */
export declare class PublicationsFileServiceProtocol {
    private readonly publicationsFileUrl;
    constructor(publicationsFileUrl: string);
    getPublicationsFile(): Promise<Uint8Array>;
}
