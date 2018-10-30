export function isTlvTag(object) {
    return object instanceof Object
        && typeof object.id === 'number'
        && typeof object.tlv16BitFlag === 'boolean'
        && typeof object.nonCriticalFlag === 'boolean'
        && typeof object.forwardFlag === 'boolean'
        && typeof object.getValueBytes === 'function'
        && typeof object.encode === 'function';
}
