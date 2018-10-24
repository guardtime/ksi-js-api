import { EventEmitter } from 'events';
import { KsiError } from '../../common/service/KsiError';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { PduPayload } from '../../common/service/PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    constructor(response, eventEmitter) {
        super(response);
        this.aborted = false;
        if (!(eventEmitter instanceof EventEmitter)) {
            throw new KsiError('Invalid event emitter');
        }
        this.eventEmitter = eventEmitter;
    }
    abort(responsePdu) {
        if (!(responsePdu instanceof PduPayload)) {
            throw new KsiError(`Invalid response bytes: ${responsePdu}`);
        }
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
