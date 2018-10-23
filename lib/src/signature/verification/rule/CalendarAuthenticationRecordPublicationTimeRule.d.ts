import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies that calendar authentication record publication time equals to calendar hash chain publication time.
 * Without calendar authentication record VerificationResultCode.Ok is returned.
 */
export declare class CalendarAuthenticationRecordPublicationTimeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
