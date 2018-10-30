export function isKsiSignature(object) {
    return object instanceof Object
        && typeof object.getAggregationHashChains === 'function'
        && typeof object.getPublicationRecord === 'function'
        && typeof object.getCalendarAuthenticationRecord === 'function'
        && typeof object.getCalendarHashChain === 'function'
        && typeof object.getAggregationTime === 'function'
        && typeof object.getRfc3161Record === 'function'
        && typeof object.getLastAggregationHashChainRootHash === 'function'
        && typeof object.getInputHash === 'function'
        && typeof object.getIdentity === 'function'
        && typeof object.isExtended === 'function'
        && typeof object.extend === 'function';
}
