/**
 * Publications file service protocol interface
 */
export interface IPublicationsFileServiceProtocol {
    getPublicationsFile(): Promise<Uint8Array>;
}

export function isPublicationsFileServiceProtocol(object: any): object is IPublicationsFileServiceProtocol {
    return 'getPublicationsFile' in object && typeof object.getPublicationsFile === 'function';
}
