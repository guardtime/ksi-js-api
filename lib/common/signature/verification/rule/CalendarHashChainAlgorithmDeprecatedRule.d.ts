import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that calendar hash chain right link hash algorithms were not deprecated at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export declare class CalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
