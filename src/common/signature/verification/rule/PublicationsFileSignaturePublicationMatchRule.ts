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
    constructor() {
        super("PublicationsFileSignaturePublicationMatchRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.')));
        }

        const signature: KsiSignature = context.getSignature();
        const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
        if (publicationRecord == null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications record is missing from signature.')));
        }

        const publicationRecordInPublicationFile: PublicationRecord | null = publicationsFile
            .getNearestPublicationRecord(publicationRecord.getPublicationTime());

        if (publicationRecordInPublicationFile === null
            || publicationRecordInPublicationFile.getPublicationTime().neq(publicationRecord.getPublicationTime())) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(new KsiVerificationError('Publications file publication record is missing.')));
        }

        return !publicationRecordInPublicationFile.getPublicationHash().equals(publicationRecord.getPublicationHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_05())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
