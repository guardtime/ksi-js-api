import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export class CalendarHashChainExistenceRule extends VerificationRule {
    constructor() {
        super("CalendarHashChainExistenceRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return context.getSignature().getCalendarHashChain() === null
            ? new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Calendar hash chain is missing.')))
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
