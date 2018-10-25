import {BigInteger} from 'big-integer';

/**
 * Ksi identity interface
 */
export interface IKsiIdentity {
    getClientId(): string;
    getMachineId(): string | null;
    getSequenceNumber(): BigInteger | null;
    getRequestTime(): BigInteger | null;
}

export function isKsiIdentity(object: any): object is IKsiIdentity {
    return 'getClientId' in object && typeof object.getClientId === 'function'
        && 'getMachineId' in object && typeof object.getMachineId === 'function'
        && 'getSequenceNumber' in object && typeof object.getSequenceNumber === 'function'
        && 'getRequestTime' in object && typeof object.getRequestTime === 'function';
}
