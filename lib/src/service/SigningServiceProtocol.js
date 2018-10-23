var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiRequest } from './KsiRequest';
import { KsiServiceError } from './KsiServiceError';
/**
 * HTTP signing service protocol
 */
export class SigningServiceProtocol {
    constructor(signingUrl) {
        this.signingUrl = signingUrl;
    }
    sign(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request instanceof KsiRequest)) {
                throw new KsiServiceError(`Invalid KSI request: ${request}`);
            }
            const headers = new Headers();
            headers.append('Content-Type', 'application/ksi-request');
            headers.append('Content-Length', request.getRequestBytes().length.toString());
            const response = yield fetch(this.signingUrl, {
                method: 'POST',
                body: request.getRequestBytes(),
                headers: headers,
                signal: request.getAbortSignal()
            });
            if (request.getAbortSignal().aborted) {
                return null;
            }
            return new Uint8Array(yield response.arrayBuffer());
        });
    }
}
