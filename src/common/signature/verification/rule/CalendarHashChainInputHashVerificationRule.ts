import {CalendarHashChain} from '../../CalendarHashChain';
import {IKsiSignature} from '../../IKsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies that last aggregation hash chain output hash is equal to calendar hash chain input hash. If calendar
 * hash chain is missing, status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainInputHashVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        return !(await signature.getLastAggregationHashChainRootHash()).equals(calendarHashChain.getInputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
