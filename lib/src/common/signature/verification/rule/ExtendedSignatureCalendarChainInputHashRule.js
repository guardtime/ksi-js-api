var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Extended signature calendar hash chain input hash rule
 */
export class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            let extendedCalendarHashChain = null;
            try {
                extendedCalendarHashChain = calendarHashChain == null
                    ? yield context.getExtendedLatestCalendarHashChain()
                    : yield context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
            }
            catch (e) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
            }
            const lastAggregationHashChainRootHash = yield signature.getLastAggregationHashChainRootHash();
            return !lastAggregationHashChainRootHash.equals(extendedCalendarHashChain.getInputHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_02())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
