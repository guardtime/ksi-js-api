import {VerificationContext} from '../VerificationContext';
import {VerificationResult} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verification policy for KSI signature
 */
export class VerificationPolicy extends VerificationRule {
    private readonly firstRule: VerificationRule;

    constructor(rule: VerificationRule, ruleName: string | null = null) {
        super(ruleName);

        this.firstRule = rule;
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        let verificationRule: VerificationRule | null = this.firstRule;
        const verificationResults: VerificationResult[] = [];

        try {
            while (verificationRule !== null) {
                const result: VerificationResult = await verificationRule.verify(context);
                verificationResults.push(result);
                verificationRule = verificationRule.getNextRule(result.getResultCode());
            }
        } catch (error) {
            throw error;
        }

        return VerificationResult.CREATE_FROM_RESULTS(this.getRuleName(), verificationResults);
    }

}
