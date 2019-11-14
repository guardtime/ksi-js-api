import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that aggregation hash chain times are consistent. It means that previous aggregation hash chain
 * aggregation time equals to current one.
 */
export declare class AggregationHashChainTimeConsistencyRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
