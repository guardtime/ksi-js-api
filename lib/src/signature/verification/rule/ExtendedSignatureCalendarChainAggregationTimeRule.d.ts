import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extended signature contains correct aggregation time.
 */
export declare class ExtendedSignatureCalendarChainAggregationTimeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
