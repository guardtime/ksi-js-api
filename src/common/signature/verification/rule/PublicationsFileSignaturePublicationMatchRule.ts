import {PublicationRecord} from '../../../publication/PublicationRecord';
import {PublicationsFile} from '../../../publication/PublicationsFile';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule checks if publications file and signature publication record match.
 */
export class PublicationsFileSignaturePublicationMatchRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const signature: KsiSignature = VerificationRule.getSignature(context);
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
        if (publicationRecord == null) {
            throw new KsiVerificationError(`Publication record is missing from KSI signature.`);
        }

        const publicationRecordInPublicationFile: PublicationRecord | null = publicationsFile
            .getNearestPublicationRecord(publicationRecord.getPublicationTime());

        // TODO: Check if it should fail
        if (publicationRecordInPublicationFile === null
            || publicationRecordInPublicationFile.getPublicationTime().neq(publicationRecord.getPublicationTime())) {

            return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
        }

        return !publicationRecordInPublicationFile.getPublicationHash().equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_05)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
