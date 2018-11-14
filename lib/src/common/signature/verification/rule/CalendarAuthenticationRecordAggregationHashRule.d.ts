import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies that calendar authentication record publication hash equals to calendar hash chain output hash.
 * Without calendar authentication record VerificationResultCode.Ok is returned.
 */
export declare class CalendarAuthenticationRecordAggregationHashRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
