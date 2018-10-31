import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that RFC3161 record output hash algorithm was not deprecated at the aggregation time.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export declare class Rfc3161RecordOutputHashAlgorithmDeprecatedRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
