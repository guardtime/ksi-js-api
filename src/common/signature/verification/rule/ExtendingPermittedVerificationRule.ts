import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that extending is permitted by user.
 */
export class ExtendingPermittedVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return context.isExtendingAllowed()
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.OK)
            : new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Extending is not allowed.')));
    }
}
