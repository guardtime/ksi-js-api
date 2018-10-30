import { BigInteger } from 'big-integer';
import { DataHash } from 'gt-js-common';
import { IKsiSignature } from '../signature/IKsiSignature';
import { IServiceCredentials } from './IServiceCredentials';
import { ISigningServiceProtocol } from './ISigningServiceProtocol';
/**
 * Signing service
 */
export declare class SigningService {
    private requests;
    private signingServiceProtocol;
    private signingServiceCredentials;
    constructor(signingServiceProtocol: ISigningServiceProtocol, signingServiceCredentials: IServiceCredentials);
    private static processPayload;
    sign(hash: DataHash, level?: BigInteger): Promise<IKsiSignature>;
}
