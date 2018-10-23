import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies document hash. If RFC3161 record is present then document hash must equal to RFC3161 record input hash.
 * Otherwise document hash is compared to aggregation hash chain input hash.
 * If document hash is not provided then VerificationResultCode.Ok is returned.
 */
export declare class DocumentHashVerificationRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
