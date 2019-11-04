import { EventEmitter } from 'events';
import { KsiHttpProtocol } from './KsiHttpProtocol';
import { KsiRequest } from './KsiRequest';
/**
 * HTTP extending service protocol
 */
export class ExtendingServiceProtocol extends KsiHttpProtocol {
    constructor(url) {
        super(url);
    }
    extend(requestBytes) {
        const eventEmitter = new EventEmitter();
        return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
    }
}
