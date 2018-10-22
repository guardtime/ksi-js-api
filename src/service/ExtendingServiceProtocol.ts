import {KsiRequest} from './KsiRequest';
import {KsiServiceError} from './KsiServiceError';

/**
 * HTTP extending service protocol
 */
export class ExtendingServiceProtocol {
    private readonly extendingUrl: string;

    constructor(extendingUrl: string) {
        this.extendingUrl = extendingUrl;
    }

    public async extend(request: KsiRequest): Promise<Uint8Array | null> {
        if (!(request instanceof KsiRequest)) {
            throw new KsiServiceError(`Invalid KSI request: ${request}`);
        }

        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/ksi-request');
        headers.append('Content-Length', request.getRequestBytes().length.toString());

        const response: Response = await fetch(this.extendingUrl, {
            method: 'POST',
            body: request.getRequestBytes(),
            headers: headers,
            signal: request.getAbortSignal()
        });

        if (request.getAbortSignal().aborted) {
            return null;
        }

        return new Uint8Array(await response.arrayBuffer());
    }

}
