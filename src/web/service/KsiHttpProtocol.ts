import {KsiServiceError} from '../../common/service/KsiServiceError';

/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    public async requestKsi(requestBytes: Uint8Array, abortController: AbortController): Promise<Uint8Array | null> {
        const response: Response = await fetch(this.url, {
            method: 'POST',
            body: requestBytes,
            headers: new Headers({
                'Content-Type': 'application/ksi-request',
                'Content-Length': requestBytes.length.toString()
            }),
            signal: abortController.signal
        });

        if (!response.ok) {
            throw new KsiServiceError(`Request failed. Error code: ${response.status}. Error message: ${response.statusText}`);
        }

        if (abortController.signal.aborted) {
            return null;
        }

        return new Uint8Array(await response.arrayBuffer());
    }

    public async download(): Promise<Uint8Array> {
        const response: Response = await fetch(this.url);

        return new Uint8Array(await response.arrayBuffer());
    }

}
