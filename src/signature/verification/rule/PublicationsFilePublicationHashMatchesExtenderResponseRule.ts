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
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());

        if (publicationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
        }

        const extendedCalendarHashChain: CalendarHashChain =
            await context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());

        return !(await extendedCalendarHashChain.calculateOutputHash()).equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
