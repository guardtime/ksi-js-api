export function isPublicationsFileServiceProtocol(object) {
    return 'getPublicationsFile' in object && typeof object.getPublicationsFile === 'function';
}
