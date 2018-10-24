import { KsiError } from '../../common/service/KsiError';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiServiceError } from '../../common/service/KsiServiceError';
import { PduPayload } from '../../common/service/PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    constructor(response, abortController) {
        super(response);
        if (!(abortController instanceof AbortController)) {
            throw new KsiError('Invalid AbortController');
        }
        this.abortController = abortController;
    }
    abort(payload) {
        if (!(payload instanceof PduPayload)) {
            throw new KsiServiceError(`Invalid response bytes: ${payload}`);
        }
        this.abortResponse = payload;
        this.abortController.abort();
    }
    getAbortResponse() {
        return this.abortResponse;
    }
    getAbortSignal() {
        return this.abortController.signal;
    }
    isAborted() {
        return this.abortController.signal.aborted;
    }
}
