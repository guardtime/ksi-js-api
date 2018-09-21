export default class TlvError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TlvError";

        Object.setPrototypeOf(this, TlvError.prototype);
    }

}
