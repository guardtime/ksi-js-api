/**
 * TLV parsing error
 */
export class TlvError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TlvError';
        Object.setPrototypeOf(this, TlvError.prototype);
    }
}
