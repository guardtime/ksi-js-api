import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks if publications file and signature publication record match.
 */
export declare class PublicationsFileSignaturePublicationMatchRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
