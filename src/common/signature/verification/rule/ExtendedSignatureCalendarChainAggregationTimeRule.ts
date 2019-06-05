import bigInteger from 'big-integer';
import {KsiServiceError} from '../../../service/KsiServiceError';
import {AggregationHashChain} from '../../AggregationHashChain';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that extended signature contains correct aggregation time.
 */
export class ExtendedSignatureCalendarChainAggregationTimeRule extends VerificationRule {

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

        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();
        const aggregationTime: bigInteger.BigInteger = aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime();

        return !aggregationTime.equals(extendedCalendarHashChain.getAggregationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_03())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
