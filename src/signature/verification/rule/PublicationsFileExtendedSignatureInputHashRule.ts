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
 * Rule checks that extender response calendar hash chain input hash matches with signature aggregation root hash.
 */
export class PublicationsFileExtendedSignatureInputHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());
        if (publicationRecord == null) {
            throw new KsiVerificationError(`No publication record found after given time in publications file:
                                            ${signature.getAggregationTime()}.`);
        }

        const extendedCalendarHashChain: CalendarHashChain = context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());

        return !extendedCalendarHashChain.getInputHash().equals(signature.getLastAggregationHashChainRootHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
