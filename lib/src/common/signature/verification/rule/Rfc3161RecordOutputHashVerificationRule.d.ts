import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies RFC3161 output hash equals to aggregation chain input hash.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export declare class Rfc3161RecordOutputHashVerificationRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
