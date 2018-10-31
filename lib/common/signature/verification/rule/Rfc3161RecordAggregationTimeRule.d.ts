import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies that aggregation hash chain aggregation time and RFC3161 record aggregation time match.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export declare class Rfc3161RecordAggregationTimeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
