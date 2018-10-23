import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { KsiSignature } from '../signature/KsiSignature';
import { IServiceCredentials } from './IServiceCredentials';
import { SigningServiceProtocol } from './SigningServiceProtocol';
/**
 * Signing service
 */
export declare class SigningService {
    private requests;
    private signingServiceProtocol;
    private signingServiceCredentials;
    constructor(signingServiceProtocol: SigningServiceProtocol, signingServiceCredentials: IServiceCredentials);
    private static processPayload;
    sign(hash: DataHash, level?: BigInteger): Promise<KsiSignature>;
}
