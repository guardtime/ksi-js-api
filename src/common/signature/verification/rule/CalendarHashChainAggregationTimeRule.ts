import {AggregationHashChain} from '../../AggregationHashChain';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies calendar hash chain aggregation time equality to last aggregation hash chain aggrega tion time.
 * Without calendar authentication record <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class CalendarHashChainAggregationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

        return aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime().neq(calendarHashChain.getAggregationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_04())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
