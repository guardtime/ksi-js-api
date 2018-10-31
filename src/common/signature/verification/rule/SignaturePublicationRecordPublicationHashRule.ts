import {PublicationRecord} from '../../../publication/PublicationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks if KSI signature calendar hash chain publication hash matches signature publication record publication hash.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export class SignaturePublicationRecordPublicationHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();

        if (publicationRecord === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        if (calendarHashChain === null) {
            throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
        }

        return publicationRecord.getPublicationHash().equals(calendarHashChain.calculateOutputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_09)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
