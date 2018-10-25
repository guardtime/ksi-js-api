import {BigInteger} from 'big-integer';
import {KsiError} from '../service/KsiError';
import {IKsiIdentity} from './IKsiIdentity';

/**
 *
 */
export class LegacyIdentity implements IKsiIdentity {
    private readonly clientId: string;

    public constructor(clientId: string) {
        if (typeof clientId !== 'string') {
            throw new KsiError('Invalid clientId');
        }
        this.clientId = clientId;
    }

    public getClientId(): string {
        return this.clientId;
    }

    public getMachineId(): string | null {
        return null;
    }

    public getSequenceNumber(): BigInteger | null {
        return null;
    }

    public getRequestTime(): BigInteger | null {
        return null;
    }
}
