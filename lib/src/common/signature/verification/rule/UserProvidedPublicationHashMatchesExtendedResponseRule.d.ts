import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * RRule checks that user provided publication hash matches extender response calendar hash chain root hash.
 */
export declare class UserProvidedPublicationHashMatchesExtendedResponseRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
