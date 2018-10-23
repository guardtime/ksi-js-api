/**
 * KSI verification error
 */
export class KsiVerificationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'KsiVerificationError';
        Object.setPrototypeOf(this, KsiVerificationError.prototype);
    }
}
