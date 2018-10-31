import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extending is permitted by user.
 */
export declare class ExtendingPermittedVerificationRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
