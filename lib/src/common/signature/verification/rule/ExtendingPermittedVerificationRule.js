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
 * Rule checks that extending is permitted by user.
 */
export class ExtendingPermittedVerificationRule extends VerificationRule {
    constructor() {
        super("ExtendingPermittedVerificationRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return context.isExtendingAllowed()
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.OK)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Extending is not allowed.')));
        });
    }
}
