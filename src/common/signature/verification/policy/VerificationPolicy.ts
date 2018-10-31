import {VerificationContext} from '../VerificationContext';
import {VerificationResult} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verification policy for KSI signature
 */
export class VerificationPolicy extends VerificationRule {
    private readonly firstRule: VerificationRule;
    private verificationResults: VerificationResult[] = [];

    constructor(rule: VerificationRule, ruleName: string | null = null) {
        super(ruleName);

        this.firstRule = rule;
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        let verificationRule: VerificationRule | null = this.firstRule;

        try {
            while (verificationRule !== null) {
                const result: VerificationResult = await verificationRule.verify(context);
                this.verificationResults.push(result);
                verificationRule = verificationRule.getNextRule(result.getResultCode());
            }
        } catch (error) {
            throw error;
        }

        Object.freeze(this.verificationResults);

        return VerificationResult.CREATE_FROM_RESULTS(this.getRuleName(), this.verificationResults);
    }

}
