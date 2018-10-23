import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that shape of the aggregation hash chain matches with chain index.
 */
export declare class AggregationHashChainShapeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
