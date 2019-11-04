/**
 * Legacy version of identity
 */
export class LegacyIdentity {
    constructor(clientId) {
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
