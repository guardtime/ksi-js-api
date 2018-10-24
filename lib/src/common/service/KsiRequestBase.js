var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiError } from './KsiError';
/**
 * KSI request base class for PDU exchanging with KSI servers.
 */
export class KsiRequestBase {
    constructor(response) {
        if (!(response instanceof Promise)) {
            throw new KsiError('Invalid response');
        }
        this.response = response;
    }
    getResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.response;
        });
    }
}
