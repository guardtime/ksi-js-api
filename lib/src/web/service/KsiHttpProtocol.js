var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiServiceError } from '../../common/service/KsiServiceError';
/**
 * Http protocol for requests
 */
export class KsiHttpProtocol {
    constructor(url) {
        this.url = url;
    }
    requestKsi(requestBytes, abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url, {
                method: 'POST',
                body: requestBytes,
                headers: new Headers({
                    'Content-Type': 'application/ksi-request',
                    'Content-Length': requestBytes.length.toString()
                }),
                signal: abortController.signal
            });
            if (!response.ok) {
                throw new KsiServiceError(`Request failed. Error code: ${response.status}. Error message: ${response.statusText}`);
            }
            if (abortController.signal.aborted) {
                return null;
            }
            return new Uint8Array(yield response.arrayBuffer());
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url);
            return new Uint8Array(yield response.arrayBuffer());
        });
    }
}
