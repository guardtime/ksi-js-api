import { HashAlgorithm } from 'gt-js-common';
import { KsiServiceError } from './KsiServiceError';
/**
 * Service credentials class for KSI service
 */
export class ServiceCredentials {
    constructor(loginId, loginKey, hmacAlgorithm = HashAlgorithm.SHA2_256) {
        if ((typeof loginId) !== 'string') {
            throw new KsiServiceError(`Invalid loginId: ${loginId}`);
        }
        if (!(loginKey instanceof Uint8Array)) {
            throw new KsiServiceError(`Invalid loginKey: ${loginId}`);
        }
        if (!(hmacAlgorithm instanceof HashAlgorithm)) {
            throw new KsiServiceError(`Invalid hmacAlgorithm: ${hmacAlgorithm}`);
        }
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
