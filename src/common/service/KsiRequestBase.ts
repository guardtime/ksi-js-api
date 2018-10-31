import {PduPayload} from './PduPayload';

/**
 * KSI request base class for PDU exchanging with KSI servers.
 */
export abstract class KsiRequestBase {
    private readonly response: Promise<Uint8Array | null>;

    protected constructor(response: Promise<Uint8Array | null>) {
        this.response = response;
    }

    public async getResponse(): Promise<Uint8Array | null> {
        return this.response;
    }

    public abstract getAbortResponse(): PduPayload;
    public abstract isAborted(): boolean;
    public abstract abort(responsePdu: PduPayload): void;
}
