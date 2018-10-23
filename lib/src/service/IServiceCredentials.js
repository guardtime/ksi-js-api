export function isIServiceCredentials(object) {
    return 'getLoginId' in object
        && 'getLoginKey' in object
        && 'getHmacAlgorithm' in object;
}
