import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Extended signature calendar hash chain input hash rule
 */
export declare class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
