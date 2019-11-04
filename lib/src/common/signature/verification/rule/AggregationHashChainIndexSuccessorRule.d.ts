import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule checks that chain index of a aggregation hash chain is successor to it's parent aggregation hash chain index.
 */
export declare class AggregationHashChainIndexSuccessorRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
