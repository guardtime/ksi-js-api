import { HashAlgorithm } from '@guardtime/gt-js-common';
/**
 * Service credentials interface
 */
export interface IServiceCredentials {
    getLoginId(): string;
    getLoginKey(): Uint8Array;
    getHmacAlgorithm(): HashAlgorithm;
}
