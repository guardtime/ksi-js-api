export function isExtendingServiceProtocol(object) {
    return 'extend' in object && typeof object.extend === 'function';
}
