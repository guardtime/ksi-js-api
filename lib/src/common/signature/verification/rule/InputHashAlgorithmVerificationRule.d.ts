import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies input hash algorithm. If RFC3161 record is present then intput hash algorithm must equal
 * to RFC3161 record input hash algorithm. Otherwise input hash algorithm is compared to aggregation hash chain input hash algorithm.
 * If input hash is not provided then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export declare class InputHashAlgorithmVerificationRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
