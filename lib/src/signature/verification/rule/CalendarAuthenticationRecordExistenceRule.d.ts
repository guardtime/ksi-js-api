import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies that KSI signature contains calendar authentication record.
 */
export declare class CalendarAuthenticationRecordExistenceRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
