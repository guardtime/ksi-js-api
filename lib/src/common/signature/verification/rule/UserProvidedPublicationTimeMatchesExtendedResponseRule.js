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
 * Rule checks that user provided publication time matches extender response calendar hash chain shape.
 */
export class UserProvidedPublicationTimeMatchesExtendedResponseRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const userPublication = context.getUserPublication();
            if (userPublication === null) {
                throw new KsiVerificationError('Invalid user publication in context: null.');
            }
            const extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
            if (extendedCalendarHashChain === null) {
                throw new KsiVerificationError('Invalid extended calendar hash chain: null.');
            }
            if (userPublication.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02);
            }
            return !signature.getAggregationTime().equals(yield extendedCalendarHashChain.calculateRegistrationTime())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
