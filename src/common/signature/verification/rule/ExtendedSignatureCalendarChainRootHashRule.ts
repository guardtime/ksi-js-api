import {KsiServiceError} from '../../../service/KsiServiceError';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that extender response calendar hash chain (extension request with current calendar hash chain
 * aggregation and publication time is used) matches with current calendar hash chain root hash. If current signature
 * does not contain calendar hash chain, VerificationResultCode.Ok is returned.
 */
export class ExtendedSignatureCalendarChainRootHashRule extends VerificationRule {
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

        return !(await calendarHashChain.calculateOutputHash()).equals(await extendedCalendarHashChain.calculateOutputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_01())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
