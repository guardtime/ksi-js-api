/**
 * HTTP signing service protocol
 */
export class SigningServiceProtocol {
    private signingUrl: string;

    constructor(signingUrl: string) {
        this.signingUrl = signingUrl;
    }

    public async sign(data: Uint8Array): Promise<Uint8Array> {
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/ksi-request');
        headers.append('Content-Length', data.length.toString());

        const response: Response = await fetch(this.signingUrl, {
            method: 'POST',
            body: data,
            headers: headers
        });

        return new Uint8Array(await response.arrayBuffer());
    }
}
