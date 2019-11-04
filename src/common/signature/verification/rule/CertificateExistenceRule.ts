import {PublicationsFile} from '../../../publication/PublicationsFile';
import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {KsiSignature} from '../../KsiSignature';
import {SignatureData} from '../../SignatureData';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export class CertificateExistenceRule extends VerificationRule {
    constructor() {
        super("CertificateExistenceRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Calendar authentication record is missing.')));
        }

        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Publications file is missing from context.')));
        }

        const signatureData: SignatureData = calendarAuthenticationRecord.getSignatureData();

        return publicationsFile.findCertificateById(signatureData.getCertificateId()) === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_01())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
