import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks if KSI signature calendar hash chain publication time matches signature publication record publication time.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export declare class SignaturePublicationRecordPublicationTimeRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
