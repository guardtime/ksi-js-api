var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verification policy for KSI signature
 */
export class VerificationPolicy extends VerificationRule {
    constructor(rule, ruleName = null) {
        super(ruleName ? ruleName : "VerificationPolicy");
        this.firstRule = rule;
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let verificationRule = this.firstRule;
            const verificationResults = [];
            try {
                while (verificationRule !== null) {
                    const result = yield verificationRule.verify(context);
                    verificationResults.push(result);
                    verificationRule = verificationRule.getNextRule(result.getResultCode());
                }
            }
            catch (error) {
                throw error;
            }
            return VerificationResult.CREATE_FROM_RESULTS(this.getRuleName(), verificationResults);
        });
    }
}
