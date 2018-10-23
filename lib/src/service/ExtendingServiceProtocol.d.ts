import { KsiRequest } from './KsiRequest';
/**
 * HTTP extending service protocol
 */
export declare class ExtendingServiceProtocol {
    private readonly extendingUrl;
    constructor(extendingUrl: string);
    extend(request: KsiRequest): Promise<Uint8Array | null>;
}
