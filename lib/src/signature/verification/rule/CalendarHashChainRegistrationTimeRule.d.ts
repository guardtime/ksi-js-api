import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule is used to verify calendar hash chain registration time (calculated from calendar hash  chain shape) equality
 * to calendar hash chain aggregation time. If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export declare class CalendarHashChainRegistrationTimeRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
