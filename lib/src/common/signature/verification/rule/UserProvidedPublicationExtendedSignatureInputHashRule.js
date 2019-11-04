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
 * Rule checks that extender response input hash equals to signature aggregation root hash.
 */
export class UserProvidedPublicationExtendedSignatureInputHashRule extends VerificationRule {
    constructor() {
        super("UserProvidedPublicationExtendedSignatureInputHashRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const userPublication = context.getUserPublication();
            if (userPublication === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.')));
            }
            let extendedCalendarHashChain = null;
            try {
                extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
            }
            catch (e) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
            }
            return !extendedCalendarHashChain.getInputHash().equals(yield signature.getLastAggregationHashChainRootHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_03())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
