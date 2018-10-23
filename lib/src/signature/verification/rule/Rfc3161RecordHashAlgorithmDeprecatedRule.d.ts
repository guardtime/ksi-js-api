import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that all hash algorithms used internally in RFC3161 record were not deprecated at the aggregation time.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export declare class Rfc3161RecordHashAlgorithmDeprecatedRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
