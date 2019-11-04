import {PublicationData} from '../../../publication/PublicationData';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * RRule checks that user provided publication hash matches extender response calendar hash chain root hash.
 */
export class UserProvidedPublicationHashMatchesExtendedResponseRule extends VerificationRule {
    constructor() {
        super("UserProvidedPublicationHashMatchesExtendedResponseRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
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

        return !(await extendedCalendarHashChain.calculateOutputHash()).equals(userPublication.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
