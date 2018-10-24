import {EventEmitter} from 'events';
import {IExtendingServiceProtocol} from '../../common/service/IExtendingServiceProtocol';
import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {KsiHttpProtocol} from './KsiHttpProtocol';
import {KsiRequest} from './KsiRequest';

/**
 * HTTP extending service protocol
 */
export class ExtendingServiceProtocol extends KsiHttpProtocol implements IExtendingServiceProtocol {

    constructor(url: string) {
        super(url);
    }

    public extend(requestBytes: Uint8Array): KsiRequestBase {
        const eventEmitter: EventEmitter = new EventEmitter();

        return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
    }

}
