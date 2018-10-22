
/**
 * HTTP publications file service protocol
 */
export class PublicationsFileServiceProtocol {
    private readonly publicationsFileUrl: string;

    constructor(publicationsFileUrl: string) {
        this.publicationsFileUrl = publicationsFileUrl;
    }

    public async getPublicationsFile(): Promise<Uint8Array> {
        const response: Response = await fetch(this.publicationsFileUrl, {
            method: 'GET'
        });

        return new Uint8Array(await response.arrayBuffer());
    }

}
