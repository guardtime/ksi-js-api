import { VerificationContext } from '../VerificationContext';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that publications file publication time matches with extender response calendar hash chain shape.
 */
export declare class PublicationsFilePublicationTimeMatchesExtenderResponseRule extends VerificationRule {
    constructor();
    verify(context: VerificationContext): Promise<VerificationResult>;
}
