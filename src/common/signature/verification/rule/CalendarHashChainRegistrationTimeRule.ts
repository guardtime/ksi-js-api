import {CalendarHashChain} from '../../CalendarHashChain';
import {IKsiSignature} from '../../IKsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule is used to verify calendar hash chain registration time (calculated from calendar hash  chain shape) equality
 * to calendar hash chain aggregation time. If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainRegistrationTimeRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        return calendarHashChain.getAggregationTime().neq(calendarHashChain.calculateRegistrationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_05)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
