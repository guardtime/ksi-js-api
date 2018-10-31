import {HashAlgorithm} from 'gt-js-common';
import {IServiceCredentials} from './IServiceCredentials';

/**
 * Service credentials class for KSI service
 */
export class ServiceCredentials implements IServiceCredentials {
    private readonly hmacAlgorithm: HashAlgorithm;
    private readonly loginId: string;
    private readonly loginKey: Uint8Array;

    constructor(loginId: string, loginKey: Uint8Array, hmacAlgorithm: HashAlgorithm = HashAlgorithm.SHA2_256) {
        this.loginId = loginId;
        this.loginKey = loginKey;
        this.hmacAlgorithm = hmacAlgorithm;
    }

    public getHmacAlgorithm(): HashAlgorithm {
        return this.hmacAlgorithm;
    }

    public getLoginId(): string {
        return this.loginId;
    }

    public getLoginKey(): Uint8Array {
        return this.loginKey;
    }

}
