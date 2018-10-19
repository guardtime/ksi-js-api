/**
 * KSI Service related error
 */
export class KsiServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'KsiServiceError';

        Object.setPrototypeOf(this, KsiServiceError.prototype);
    }

}
