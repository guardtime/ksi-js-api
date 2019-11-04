import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extender response calendar hash chain (extension request with current calendar hash chain
 * aggregation and publication time is used) matches with current calendar hash chain root hash. If current signature
 * does not contain calendar hash chain, VerificationResultCode.Ok is returned.
 */
export declare class ExtendedSignatureCalendarChainRootHashRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
