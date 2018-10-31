import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks if KSI signature contains publication record.
 */
export declare class SignaturePublicationRecordExistenceRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
