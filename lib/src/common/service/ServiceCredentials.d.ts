import { HashAlgorithm } from '@guardtime/gt-js-common';
import { IServiceCredentials } from './IServiceCredentials';
/**
 * Service credentials class for KSI service
 */
export declare class ServiceCredentials implements IServiceCredentials {
    private readonly hmacAlgorithm;
    private readonly loginId;
    private readonly loginKey;
    constructor(loginId: string, loginKey: Uint8Array, hmacAlgorithm?: HashAlgorithm);
    getHmacAlgorithm(): HashAlgorithm;
    getLoginId(): string;
    getLoginKey(): Uint8Array;
}
