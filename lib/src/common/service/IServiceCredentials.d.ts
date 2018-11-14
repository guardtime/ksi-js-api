import { HashAlgorithm } from 'gt-js-common';
/**
 * Service credentials interface
 */
export interface IServiceCredentials {
    getLoginId(): string;
    getLoginKey(): Uint8Array;
    getHmacAlgorithm(): HashAlgorithm;
}
