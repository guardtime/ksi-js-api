import {DataHash} from '@guardtime/gt-js-common';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Extended signature calendar hash chain input hash rule
 */
export class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        let extendedCalendarHashChain: CalendarHashChain | null = null;
        try {
            extendedCalendarHashChain = calendarHashChain == null
                ? await context.getExtendedLatestCalendarHashChain()
                : await context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
        } catch (e) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(e));
        }

        const lastAggregationHashChainRootHash: DataHash = await signature.getLastAggregationHashChainRootHash();

        return !lastAggregationHashChainRootHash.equals(extendedCalendarHashChain.getInputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_02())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
