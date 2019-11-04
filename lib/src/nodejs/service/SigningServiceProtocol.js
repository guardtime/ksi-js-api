import { EventEmitter } from 'events';
import { KsiHttpProtocol } from './KsiHttpProtocol';
import { KsiRequest } from './KsiRequest';
/**
 * HTTP signing service protocol
 */
export class SigningServiceProtocol extends KsiHttpProtocol {
    constructor(url) {
        super(url);
    }
    sign(requestBytes) {
        const eventEmitter = new EventEmitter();
        return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
    }
}
