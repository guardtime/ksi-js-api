export function isKsiIdentity(object) {
    return 'getClientId' in object && typeof object.getClientId === 'function'
        && 'getMachineId' in object && typeof object.getMachineId === 'function'
        && 'getSequenceNumber' in object && typeof object.getSequenceNumber === 'function'
        && 'getRequestTime' in object && typeof object.getRequestTime === 'function';
}
