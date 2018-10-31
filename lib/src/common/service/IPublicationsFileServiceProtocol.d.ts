/**
 * Publications file service protocol interface
 */
export interface IPublicationsFileServiceProtocol {
    getPublicationsFile(): Promise<Uint8Array>;
}
