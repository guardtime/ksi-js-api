import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Checks if extended signature calendar hash chain right links are equal to not extended signature right links.
 */
export class ExtendedSignatureCalendarHashChainRightLinksMatchRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            throw new KsiVerificationError('Invalid calendar hash chain: null');
        }

        const extendedCalendarHashChain: CalendarHashChain =
            await context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());

        return calendarHashChain.areRightLinksEqual(extendedCalendarHashChain)
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.OK)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_04);
    }
}
