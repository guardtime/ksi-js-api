import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that extender response calendar hash chain right link hash algorithms are not deprecated.
 */
export declare class ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
