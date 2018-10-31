import { HashAlgorithm } from 'gt-js-common';
/**
 * Service credentials class for KSI service
 */
export class ServiceCredentials {
    constructor(loginId, loginKey, hmacAlgorithm = HashAlgorithm.SHA2_256) {
        this.loginId = loginId;
        this.loginKey = loginKey;
        this.hmacAlgorithm = hmacAlgorithm;
    }
    getHmacAlgorithm() {
        return this.hmacAlgorithm;
    }
    getLoginId() {
        return this.loginId;
    }
    getLoginKey() {
        return this.loginKey;
    }
}
