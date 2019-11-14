import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies that aggregation hash chain index and RFC3161 record chain index match.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export declare class Rfc3161RecordChainIndexRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
