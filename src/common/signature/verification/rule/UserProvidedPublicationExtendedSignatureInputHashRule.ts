import {PublicationData} from '../../../publication/PublicationData';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that extender response input hash equals to signature aggregation root hash.
 */
export class UserProvidedPublicationExtendedSignatureInputHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            throw new KsiVerificationError('Invalid user publication in context: null.');
        }

        const extendedCalendarHashChain: CalendarHashChain =
            await context.getExtendedCalendarHashChain(userPublication.getPublicationTime());

        return !extendedCalendarHashChain.getInputHash().equals(await signature.getLastAggregationHashChainRootHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
