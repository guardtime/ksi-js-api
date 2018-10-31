import {PublicationData} from '../../../publication/PublicationData';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that user provided publication time matches extender response calendar hash chain shape.
 */
export class UserProvidedPublicationTimeMatchesExtendedResponseRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const userPublication: PublicationData | null = context.getUserPublication();
        if (userPublication === null) {
            throw new KsiVerificationError('Invalid user publication in context: null.');
        }

        const extendedCalendarHashChain: CalendarHashChain =
            await context.getExtendedCalendarHashChain(userPublication.getPublicationTime());

        if (userPublication.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02);
        }

        return signature.getAggregationTime().equals(extendedCalendarHashChain.calculateRegistrationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
