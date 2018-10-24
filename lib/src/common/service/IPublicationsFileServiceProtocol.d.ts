/**
 * Publications file service protocol interface
 */
export interface IPublicationsFileServiceProtocol {
    getPublicationsFile(): Promise<Uint8Array>;
}
export declare function isPublicationsFileServiceProtocol(object: any): object is IPublicationsFileServiceProtocol;
