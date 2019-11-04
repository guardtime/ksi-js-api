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
    constructor() {
        super("UserProvidedPublicationExtendedSignatureInputHashRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.')));
        }

        let extendedCalendarHashChain: CalendarHashChain | null = null;
        try {
            extendedCalendarHashChain = await context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
        } catch (e) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(e));
        }

        return !extendedCalendarHashChain.getInputHash().equals(await signature.getLastAggregationHashChainRootHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_03())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
