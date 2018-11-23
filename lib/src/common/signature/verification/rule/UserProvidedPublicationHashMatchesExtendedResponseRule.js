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
 * RRule checks that user provided publication hash matches extender response calendar hash chain root hash.
 */
export class UserProvidedPublicationHashMatchesExtendedResponseRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPublication = context.getUserPublication();
            if (userPublication === null) {
                throw new KsiVerificationError('Invalid user publication in context: null.');
            }
            const extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
            if (extendedCalendarHashChain === null) {
                throw new KsiVerificationError('Invalid extended calendar hash chain: null.');
            }
            return !(yield extendedCalendarHashChain.calculateOutputHash()).equals(userPublication.getPublicationHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
