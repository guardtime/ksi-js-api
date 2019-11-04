import {PublicationRecord} from '../../../publication/PublicationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks if KSI signature calendar hash chain publication time matches signature publication record publication time.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export class SignaturePublicationRecordPublicationTimeRule extends VerificationRule {
    constructor() {
        super("SignaturePublicationRecordPublicationTimeRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();

        if (publicationRecord === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain is missing from signature.')));
        }

        return publicationRecord.getPublicationTime().neq(calendarHashChain.getPublicationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_07())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
