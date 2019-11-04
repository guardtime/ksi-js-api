import { BigInteger } from 'big-integer';
/**
 * Ksi identity interface
 */
export interface IKsiIdentity {
    getClientId(): string;
    getMachineId(): string | null;
    getSequenceNumber(): BigInteger | null;
    getRequestTime(): BigInteger | null;
}
