import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule verifies that calendar authentication record publication time equals to calendar hash chain publication time.
 * Without calendar authentication record VerificationResultCode.Ok is returned.
 */
export class CalendarAuthenticationRecordPublicationTimeRule extends VerificationRule {
    constructor() {
        super("CalendarAuthenticationRecordPublicationTimeRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Calendar hash chain is missing from signature.')));
        }

        return calendarHashChain.getPublicationTime().neq(calendarAuthenticationRecord.getPublicationData().getPublicationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_06())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
