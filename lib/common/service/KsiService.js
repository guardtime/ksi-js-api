var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bigInteger from 'big-integer';
import { KsiServiceError } from './KsiServiceError';
/**
 * KSI service.
 */
export class KsiService {
    constructor(signingService = null, extendingService = null, publicationsFileService) {
        this.signingService = signingService;
        this.extendingService = extendingService;
        this.publicationsFileService = publicationsFileService;
    }
    sign(hash, level = bigInteger(0)) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signingService) {
                throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
            }
            return this.signingService.sign(hash, level);
        });
    }
    extend(aggregationTime, publicationTime = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.extendingService) {
                throw new KsiServiceError('Extending service not defined. Cannot use extending.');
            }
            return this.extendingService.extend(aggregationTime, publicationTime);
        });
    }
    getPublicationsFile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publicationsFileService) {
                throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
            }
            return this.publicationsFileService.getPublicationsFile();
        });
    }
}
