import {BigInteger} from 'big-integer';
import {PublicationData} from '../../../publication/PublicationData';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that signature is created before user provided publication.
 */
export class UserProvidedPublicationCreationTimeVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const aggregationTime: BigInteger = context.getSignature().getAggregationTime();
        const userPublication: PublicationData | null = context.getUserPublication();

        if (userPublication == null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.')));
        }

        const userPublicationTime: BigInteger = userPublication.getPublicationTime();

        return aggregationTime.geq(userPublicationTime)
            ? new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('User publication is created before signature.')))
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
