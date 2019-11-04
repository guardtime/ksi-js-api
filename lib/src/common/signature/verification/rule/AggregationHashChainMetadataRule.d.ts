import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies if all metadata tags in aggregation hash chains are valid.
 */
export declare class AggregationHashChainMetadataRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
