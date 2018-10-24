import {EventEmitter} from 'events';
import {ISigningServiceProtocol} from '../../common/service/ISigningServiceProtocol';
import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {KsiHttpProtocol} from './KsiHttpProtocol';
import {KsiRequest} from './KsiRequest';

/**
 * HTTP signing service protocol
 */
export class SigningServiceProtocol extends KsiHttpProtocol implements ISigningServiceProtocol {
    constructor(url: string) {
        super(url);
    }

    public sign(requestBytes: Uint8Array): KsiRequestBase {
        const eventEmitter: EventEmitter = new EventEmitter();

        return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
    }
}
