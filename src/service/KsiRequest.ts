import {KsiServiceError} from './KsiServiceError';
import {PduPayload} from './PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest {
    private abortController: AbortController = new AbortController();
    private responsePdu: PduPayload;
    private readonly requestBytes: Uint8Array;

    constructor(requestBytes: Uint8Array) {
        if (!(requestBytes instanceof Uint8Array)) {
            throw new KsiServiceError(`Invalid request bytes: ${requestBytes}`);
        }

        this.requestBytes = requestBytes;
    }

    public abort(responsePdu: PduPayload): void {
        if (!(responsePdu instanceof PduPayload)) {
            throw new KsiServiceError(`Invalid response bytes: ${responsePdu}`);
        }

        this.responsePdu = responsePdu;
        this.abortController.abort();
    }

    public getResponsePdu(): PduPayload {
        return this.responsePdu;
    }

    public getRequestBytes(): Uint8Array {
        return this.requestBytes;
    }

    public getAbortSignal(): AbortSignal {
        return this.abortController.signal;
    }
}
