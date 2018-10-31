import { PduPayload } from './PduPayload';
/**
 * KSI request base class for PDU exchanging with KSI servers.
 */
export declare abstract class KsiRequestBase {
    private readonly response;
    protected constructor(response: Promise<Uint8Array | null>);
    getResponse(): Promise<Uint8Array | null>;
    abstract getAbortResponse(): PduPayload;
    abstract isAborted(): boolean;
    abstract abort(responsePdu: PduPayload): void;
}
