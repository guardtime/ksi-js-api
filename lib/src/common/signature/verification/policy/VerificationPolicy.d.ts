import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verification policy for KSI signature
 */
export declare class VerificationPolicy extends VerificationRule {
    private readonly firstRule;
    private verificationResults;
    constructor(rule?: VerificationRule | null, ruleName?: string | null);
    verify(context: VerificationContext): Promise<VerificationResult>;
}
