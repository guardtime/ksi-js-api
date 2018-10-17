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
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            throw new KsiVerificationError('Invalid user publication in context: null.');
        }

        const extendedCalendarHashChain: CalendarHashChain = context.getExtendedCalendarHashChain(userPublication.getPublicationTime());

        return (await extendedCalendarHashChain.calculateOutputHash()).equals(userPublication.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
