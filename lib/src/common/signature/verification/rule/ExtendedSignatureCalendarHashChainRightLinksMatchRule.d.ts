import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Checks if extended signature calendar hash chain right links are equal to not extended signature right links.
 */
export declare class ExtendedSignatureCalendarHashChainRightLinksMatchRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
