import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that user has provided a publication.
 */
export class UserProvidedPublicationExistenceRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        VerificationRule.verifyContext(context);

        return context.getUserPublication() === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
