/// <reference types="node" />
import { EventEmitter } from 'events';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { PduPayload } from '../../common/service/PduPayload';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export declare class KsiRequest extends KsiRequestBase {
    static readonly ABORT_EVENT: string;
    private aborted;
    private readonly eventEmitter;
    private responsePayload;
    constructor(response: Promise<Uint8Array | null>, eventEmitter: EventEmitter);
    abort(responsePdu: PduPayload): void;
    getAbortResponse(): PduPayload;
    isAborted(): boolean;
}
