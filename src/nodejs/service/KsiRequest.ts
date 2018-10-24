import {EventEmitter} from 'events';
import {ClientRequest, RequestOptions} from 'http';
import {KsiError} from '../../common/service/KsiError';
import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {PduPayload} from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    public static readonly ABORT_EVENT: string = 'ABORT';

    private aborted: boolean = false;
    private readonly eventEmitter: EventEmitter;
    private responsePayload: PduPayload;

    constructor(response: Promise<Uint8Array | null>, eventEmitter: EventEmitter) {
        super(response);

        if (!(eventEmitter instanceof EventEmitter)) {
            throw new KsiError('Invalid event emitter');
        }

        this.eventEmitter = eventEmitter;
    }

    public abort(responsePdu: PduPayload): void {
        if (!(responsePdu instanceof PduPayload)) {
            throw new KsiError(`Invalid response bytes: ${responsePdu}`);
        }

        this.responsePayload = responsePdu;
        this.eventEmitter.emit(KsiRequest.ABORT_EVENT);
    }

    public getAbortResponse(): PduPayload {
        return this.responsePayload;
    }

    public isAborted(): boolean {
        return this.aborted;
    }
}
