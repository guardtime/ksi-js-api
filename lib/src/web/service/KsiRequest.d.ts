import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { PduPayload } from '../../common/service/PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export declare class KsiRequest extends KsiRequestBase {
    private readonly abortController;
    private abortResponse;
    constructor(response: Promise<Uint8Array | null>, abortController: AbortController);
    abort(payload: PduPayload): void;
    getAbortResponse(): PduPayload;
    isAborted(): boolean;
}
