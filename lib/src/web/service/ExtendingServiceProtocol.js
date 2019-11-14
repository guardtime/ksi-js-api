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
        const abortController = new AbortController();
        return new KsiRequest(this.requestKsi(requestBytes, abortController), abortController);
    }
}
