/**
 * Http protocol for requests
 */
export declare class KsiHttpProtocol {
    private readonly url;
    constructor(url: string);
    requestKsi(requestBytes: Uint8Array, abortController: AbortController): Promise<Uint8Array | null>;
    download(): Promise<Uint8Array>;
}
