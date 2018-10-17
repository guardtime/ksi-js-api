import {PublicationRecord} from '../../../publication/PublicationRecord';
import {PublicationsFile} from '../../../publication/PublicationsFile';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks that publications file publication time matches with extender response calendar hash chain shape.
 */
export class PublicationsFilePublicationTimeMatchesExtenderResponseRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());

        if (publicationRecord == null) {
            throw new KsiVerificationError(`No publication record found after given time in publications file:
                                            ${signature.getAggregationTime()}.`);
        }

        const extendedCalendarHashChain: CalendarHashChain = context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());

        if (publicationRecord.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02);
        }

        return signature.getAggregationTime().neq(extendedCalendarHashChain.calculateRegistrationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
