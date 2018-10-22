import {HashAlgorithm} from 'gt-js-common';

/**
 * Service credentials interface
 */
export interface IServiceCredentials {
    getLoginId(): string;

    getLoginKey(): Uint8Array;

    getHmacAlgorithm(): HashAlgorithm;
}

export function isIServiceCredentials(object: any): object is IServiceCredentials {
    return 'getLoginId' in object
        && 'getLoginKey' in object
        && 'getHmacAlgorithm' in object;
}
