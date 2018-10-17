import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies that calendar authentication record publication hash equals to calendar hash chain output hash.
 * Without calendar authentication record VerificationResultCode.Ok is returned.
 */
export class CalendarAuthenticationRecordAggregationHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return !(await calendarHashChain.calculateOutputHash())
            .equals(calendarAuthenticationRecord.getPublicationData().getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_08)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
