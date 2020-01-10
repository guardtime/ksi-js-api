import { DataHash } from '@guardtime/gt-js-common';
import { BigInteger } from 'big-integer';
import { KsiSignature } from '../signature/KsiSignature';
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
    sign(hash: DataHash, level?: BigInteger): Promise<KsiSignature>;
    protected generateRequestId(): BigInteger;
}