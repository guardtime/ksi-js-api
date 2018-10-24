import {KsiError} from '../../common/service/KsiError';
import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {KsiServiceError} from '../../common/service/KsiServiceError';
import {PduPayload} from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    private readonly abortController: AbortController;
    private abortResponse: PduPayload;

    constructor(response: Promise<Uint8Array | null>, abortController: AbortController) {
        super(response);

        if (!(abortController instanceof AbortController)) {
            throw new KsiError('Invalid AbortController');
        }

        this.abortController = abortController;
    }

    public abort(payload: PduPayload): void {
        if (!(payload instanceof PduPayload)) {
            throw new KsiServiceError(`Invalid response bytes: ${payload}`);
        }

        this.abortResponse = payload;
        this.abortController.abort();
    }

    public getAbortResponse(): PduPayload {
        return this.abortResponse;
    }

    public getAbortSignal(): AbortSignal {
        return this.abortController.signal;
    }

    public isAborted(): boolean {
        return this.abortController.signal.aborted;
    }

}
