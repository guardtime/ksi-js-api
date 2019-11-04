import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that aggregation hash chains use hash algorithms that were not deprecated at the aggregation time.
 */
export declare class AggregationHashChainAlgorithmDeprecatedRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
