import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that extending is permitted by user.
 */
export class ExtendingPermittedVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        VerificationRule.verifyContext(context);

        return context.isExtendingAllowed()
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.OK)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
    }
}
