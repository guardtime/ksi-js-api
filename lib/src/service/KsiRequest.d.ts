import { PduPayload } from './PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export declare class KsiRequest {
    private abortController;
    private responsePdu;
    private readonly requestBytes;
    constructor(requestBytes: Uint8Array);
    abort(responsePdu: PduPayload): void;
    getResponsePdu(): PduPayload;
    getRequestBytes(): Uint8Array;
    getAbortSignal(): AbortSignal;
}
