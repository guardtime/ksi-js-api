import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies calendar hash chain aggregation time equality to last aggregation hash chain aggregation time.
 * Without calendar authentication record <see cref="VerificationResultCode.Ok" /> is returned.
 */
export declare class CalendarHashChainAggregationTimeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
