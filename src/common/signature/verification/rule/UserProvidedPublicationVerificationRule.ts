import {PublicationData} from '../../../publication/PublicationData';
import {PublicationRecord} from '../../../publication/PublicationRecord';
import {IKsiSignature} from '../../IKsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that user provided publication equals to publication in KSI signature.
 */
export class UserProvidedPublicationVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            throw new KsiVerificationError('Invalid user publication in context: null.');
        }

        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
        if (publicationRecord === null) {
            throw new KsiVerificationError('Invalid publication record in signature: null');
        }

        if (userPublication.getPublicationTime().neq(publicationRecord.getPublicationTime())) {
            console.log(`User provided publication time does not equal to signature publication time.
                         User provided publication time: ${userPublication.getPublicationTime()};
                         Signature publication time: ${publicationRecord.getPublicationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
        }

        return !userPublication.getPublicationHash().equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_04)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
