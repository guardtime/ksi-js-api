import { KsiRequest } from './KsiRequest';
/**
 * HTTP signing service protocol
 */
export declare class SigningServiceProtocol {
    private readonly signingUrl;
    constructor(signingUrl: string);
    sign(request: KsiRequest): Promise<Uint8Array | null>;
}
