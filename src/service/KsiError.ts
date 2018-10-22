/**
 * KSI related error
 */
export class KsiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'KsiError';

        Object.setPrototypeOf(this, KsiError.prototype);
    }

}
