var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiSignature } from '../../KsiSignature';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verification policy for KSI signature
 */
export class VerificationPolicy extends VerificationRule {
    constructor(rule = null, ruleName = null) {
        super(ruleName);
        this.verificationResults = [];
        if (rule !== null) {
            VerificationRule.verifyRule(rule);
        }
        this.firstRule = rule;
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context instanceof VerificationContext)) {
                throw new Error('Context is invalid');
            }
            if (!(context.getSignature() instanceof KsiSignature)) {
                throw new KsiVerificationError('Invalid KSI signature in context');
            }
            let verificationRule = this.firstRule;
            try {
                while (verificationRule !== null) {
                    const result = yield verificationRule.verify(context);
                    this.verificationResults.push(result);
                    verificationRule = verificationRule.getNextRule(result.getResultCode());
                }
            }
            catch (error) {
                throw error;
            }
            Object.freeze(this.verificationResults);
            return VerificationResult.CREATE_FROM_RESULTS(this.getRuleName(), this.verificationResults);
        });
    }
}
