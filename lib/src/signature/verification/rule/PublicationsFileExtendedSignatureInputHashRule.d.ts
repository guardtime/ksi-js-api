import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extender response calendar hash chain input hash matches with signature aggregation root hash.
 */
export declare class PublicationsFileExtendedSignatureInputHashRule extends VerificationRule {
    verify(context: VerificationContext): Promise<VerificationResult>;
}
