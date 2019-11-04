import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies that given document hash level is not greater than the first link level
 * correction of the first aggregation hash chain. In case RFC3161 signature the given document hash level must be 0.
 * If the level is equal to or less than expected then VerificationResultCode.Ok is returned.
 */
export declare class DocumentHashLevelVerificationRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
