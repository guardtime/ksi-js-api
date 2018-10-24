/**
 * KSI verification error
 */
export class KsiVerificationError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'KsiVerificationError';

        Object.setPrototypeOf(this, KsiVerificationError.prototype);
    }
}
