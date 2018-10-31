import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {PduPayload} from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    private readonly abortController: AbortController;
    private abortResponse: PduPayload;

    constructor(response: Promise<Uint8Array | null>, abortController: AbortController) {
        super(response);

        this.abortController = abortController;
    }

    public abort(payload: PduPayload): void {
        this.abortResponse = payload;
        this.abortController.abort();
    }

    public getAbortResponse(): PduPayload {
        return this.abortResponse;
    }

    public isAborted(): boolean {
        return this.abortController.signal.aborted;
    }

}
