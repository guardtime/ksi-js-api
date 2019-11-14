import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule that always returns VerificationResultCode.Ok
 */
export declare class SuccessResultRule extends VerificationRule {
    verify(): Promise<VerificationResult>;
}
