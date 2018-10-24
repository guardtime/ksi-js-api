import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationResult} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verification policy for KSI signature
 */
export class VerificationPolicy extends VerificationRule {
    private readonly firstRule: VerificationRule | null;
    private verificationResults: VerificationResult[] = [];

    constructor(rule: VerificationRule | null = null, ruleName: string | null = null) {
        super(ruleName);

        if (rule !== null) {
            VerificationRule.verifyRule(rule);
        }

        this.firstRule = rule;
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        if (!(context instanceof VerificationContext)) {
            throw new Error('Context is invalid');
        }

        if (!(context.getSignature() instanceof KsiSignature)) {
            throw new KsiVerificationError('Invalid KSI signature in context');
        }

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
