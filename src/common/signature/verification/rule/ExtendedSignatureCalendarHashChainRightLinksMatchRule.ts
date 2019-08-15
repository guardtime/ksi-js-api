import {KsiServiceError} from '../../../service/KsiServiceError';
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
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain is missing from signature.')));
        }

        let extendedCalendarHashChain: CalendarHashChain | null = null;
        try {
            extendedCalendarHashChain = await context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
        } catch (e) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(e));
        }

        return calendarHashChain.areRightLinksEqual(extendedCalendarHashChain)
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.OK)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_04());
    }
}
