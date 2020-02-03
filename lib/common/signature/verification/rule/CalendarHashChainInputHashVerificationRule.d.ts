import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies that last aggregation hash chain output hash is equal to calendar hash chain input hash. If calendar
 * hash chain is missing, status VerificationResultCode.Ok is returned.
 */
export declare class CalendarHashChainInputHashVerificationRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
