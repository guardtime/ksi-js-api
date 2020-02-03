import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks if KSI signature calendar hash chain publication hash matches signature publication record publication hash.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export declare class SignaturePublicationRecordPublicationHashRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
