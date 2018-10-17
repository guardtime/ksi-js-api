import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export class CalendarHashChainExistenceRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return VerificationRule.getSignature(context).getCalendarHashChain() === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
