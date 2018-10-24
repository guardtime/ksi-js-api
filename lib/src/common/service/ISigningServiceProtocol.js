export function isSigningServiceProtocol(object) {
    return 'sign' in object && typeof object.sign === 'function';
}
