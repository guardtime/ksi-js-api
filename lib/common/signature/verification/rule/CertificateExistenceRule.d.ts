import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export declare class CertificateExistenceRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
