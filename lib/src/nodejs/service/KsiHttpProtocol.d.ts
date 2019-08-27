import { EventEmitter } from 'events';
/**
 * Http protocol for requests
 */
export declare class KsiHttpProtocol {
    private readonly url;
    constructor(url: string);
    requestKsi(requestBytes: Uint8Array, eventEmitter: EventEmitter): Promise<Uint8Array | null>;
    download(): Promise<Uint8Array>;
    private makeRequest;
}
