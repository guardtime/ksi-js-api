import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that publications file publication hash matches with extender response calendar hash chain root hash.
 */
export declare class PublicationsFilePublicationHashMatchesExtenderResponseRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
