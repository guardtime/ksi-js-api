import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that extender response input hash equals to signature aggregation root hash.
 */
export declare class UserProvidedPublicationExtendedSignatureInputHashRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
