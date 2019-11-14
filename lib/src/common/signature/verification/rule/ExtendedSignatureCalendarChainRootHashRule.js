var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extender response calendar hash chain (extension request with current calendar hash chain
 * aggregation and publication time is used) matches with current calendar hash chain root hash. If current signature
 * does not contain calendar hash chain, VerificationResultCode.Ok is returned.
 */
export class ExtendedSignatureCalendarChainRootHashRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain is missing from signature.')));
            }
            let extendedCalendarHashChain = null;
            try {
                extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
            }
            catch (e) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
            }
            return !(yield calendarHashChain.calculateOutputHash()).equals(yield extendedCalendarHashChain.calculateOutputHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_01())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
