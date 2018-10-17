import bigInteger from 'big-integer';
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
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        const extendedCalendarHashChain: CalendarHashChain = calendarHashChain == null
            ? context.getExtendedLatestCalendarHashChain()
            : context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());

        if (extendedCalendarHashChain === null) {
            throw new KsiVerificationError('Received invalid extended calendar hash chain from context extension function: null.');
        }

        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();
        const aggregationTime: bigInteger.BigInteger = aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime();

        return !aggregationTime.equals(extendedCalendarHashChain.getAggregationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
