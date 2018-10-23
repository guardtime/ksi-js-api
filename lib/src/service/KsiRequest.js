import { KsiServiceError } from './KsiServiceError';
import { PduPayload } from './PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest {
    constructor(requestBytes) {
        this.abortController = new AbortController();
        if (!(requestBytes instanceof Uint8Array)) {
            throw new KsiServiceError(`Invalid request bytes: ${requestBytes}`);
        }
        this.requestBytes = requestBytes;
    }
    abort(responsePdu) {
        if (!(responsePdu instanceof PduPayload)) {
            throw new KsiServiceError(`Invalid response bytes: ${responsePdu}`);
        }
        this.responsePdu = responsePdu;
        this.abortController.abort();
    }
    getResponsePdu() {
        return this.responsePdu;
    }
    getRequestBytes() {
        return this.requestBytes;
    }
    getAbortSignal() {
        return this.abortController.signal;
    }
}
