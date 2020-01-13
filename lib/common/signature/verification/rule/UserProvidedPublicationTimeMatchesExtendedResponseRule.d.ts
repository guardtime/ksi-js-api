import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that user provided publication time matches extender response calendar hash chain shape.
 */
export declare class UserProvidedPublicationTimeMatchesExtendedResponseRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
