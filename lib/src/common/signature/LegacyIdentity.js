import { KsiError } from '../service/KsiError';
/**
 *
 */
export class LegacyIdentity {
    constructor(clientId) {
        if (typeof clientId !== 'string') {
            throw new KsiError('Invalid clientId');
        }
        this.clientId = clientId;
    }
    getClientId() {
        return this.clientId;
    }
    getMachineId() {
        return null;
    }
    getSequenceNumber() {
        return null;
    }
    getRequestTime() {
        return null;
    }
}
