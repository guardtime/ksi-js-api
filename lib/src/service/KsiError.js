/**
 * KSI related error
 */
export class KsiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'KsiError';
        Object.setPrototypeOf(this, KsiError.prototype);
    }
}
