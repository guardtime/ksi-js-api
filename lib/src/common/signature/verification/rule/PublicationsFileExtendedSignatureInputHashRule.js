var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extender response calendar hash chain input hash matches with signature aggregation root hash.
 */
export class PublicationsFileExtendedSignatureInputHashRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const publicationsFile = context.getPublicationsFile();
            if (publicationsFile === null) {
                throw new KsiVerificationError('Invalid publications file in context: null.');
            }
            const publicationRecord = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());
            if (publicationRecord == null) {
                throw new KsiVerificationError(`No publication record found after given time in publications file:
                                            ${signature.getAggregationTime()}.`);
            }
            const extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());
            return !extendedCalendarHashChain.getInputHash().equals(yield signature.getLastAggregationHashChainRootHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_03)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
