import { BigInteger } from 'big-integer';
import { IKsiIdentity } from './IKsiIdentity';
/**
 * Legacy version of identity
 */
export declare class LegacyIdentity implements IKsiIdentity {
    private readonly clientId;
    constructor(clientId: string);
    getClientId(): string;
    getMachineId(): string | null;
    getSequenceNumber(): BigInteger | null;
    getRequestTime(): BigInteger | null;
}
