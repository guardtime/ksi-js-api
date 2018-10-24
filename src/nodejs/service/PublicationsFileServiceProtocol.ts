import {KsiHttpProtocol} from './KsiHttpProtocol';

/**
 * HTTP signing service protocol
 */
export class PublicationsFileServiceProtocol extends KsiHttpProtocol {
    constructor(url: string) {
        super(url);
    }

    public async getPublicationsFile(): Promise<Uint8Array> {
        return this.download();
    }
}
