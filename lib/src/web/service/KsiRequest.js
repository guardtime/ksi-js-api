import { KsiRequestBase } from '../../common/service/KsiRequestBase';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    constructor(response, abortController) {
        super(response);
        this.abortController = abortController;
    }
    abort(payload) {
        this.abortResponse = payload;
        this.abortController.abort();
    }
    getAbortResponse() {
        return this.abortResponse;
    }
    isAborted() {
        return this.abortController.signal.aborted;
    }
}
