import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature internal consistency.
 */
export declare class InternalVerificationPolicy extends VerificationPolicy {
    constructor();
    private static verifyInput;
    private static verifyRfc3161;
    private static verifyAggregationChain;
    private static verifyCalendarChain;
}
