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
        const abortController = new AbortController();
        return new KsiRequest(this.requestKsi(requestBytes, abortController), abortController);
    }
}
