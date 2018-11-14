import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies if all aggregation hash chains are consistent. e.g. previous aggregation hash chain output hash
 * equals to current aggregation hash chain input hash.
 */
export declare class AggregationHashChainConsistencyRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
