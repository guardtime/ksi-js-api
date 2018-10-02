export default class PublicationsFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PublicationsFileError";

        Object.setPrototypeOf(this, PublicationsFileError.prototype);
    }

}
