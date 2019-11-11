import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies that KSI signature contains calendar authentication record.
 */
export class CalendarAuthenticationRecordExistenceRule extends VerificationRule {
    constructor() {
        super("CalendarAuthenticationRecordExistenceRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        return context.getSignature().getCalendarAuthenticationRecord() === null
            ? new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Calendar authentication record is missing from signature.')))
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
