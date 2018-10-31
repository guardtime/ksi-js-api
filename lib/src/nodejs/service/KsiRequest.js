import { KsiRequestBase } from '../../common/service/KsiRequestBase';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    constructor(response, eventEmitter) {
        super(response);
        this.aborted = false;
        this.eventEmitter = eventEmitter;
    }
    abort(responsePdu) {
        this.responsePayload = responsePdu;
        this.eventEmitter.emit(KsiRequest.ABORT_EVENT);
    }
    getAbortResponse() {
        return this.responsePayload;
    }
    isAborted() {
        return this.aborted;
    }
}
KsiRequest.ABORT_EVENT = 'ABORT';
