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
 * Rule checks that publications file publication hash matches with extender response calendar hash chain root hash.
 */
export class PublicationsFilePublicationHashMatchesExtenderResponseRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.')));
        }

        const signature: KsiSignature = context.getSignature();
        const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());

        if (publicationRecord == null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                // tslint:disable-next-line:max-line-length
                VerificationError.GEN_02(new KsiVerificationError(`No publication record found after given time in publications file: ${signature.getAggregationTime()}.`)));
        }

        let extendedCalendarHashChain: CalendarHashChain | null = null;
        try {
            extendedCalendarHashChain = await context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());
        } catch (e) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(e));
        }

        return !(await extendedCalendarHashChain.calculateOutputHash()).equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
