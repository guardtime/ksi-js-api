/**
 * Publications File related error
 */
export class PublicationsFileError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PublicationsFileError';
        Object.setPrototypeOf(this, PublicationsFileError.prototype);
    }
}
