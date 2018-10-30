import {PublicationsFile} from '../../../publication/PublicationsFile';
import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {IKsiSignature} from '../../IKsiSignature';
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
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            // TODO: Should it return NA?
            throw new KsiVerificationError('Invalid calendar authentication record: null');
        }

        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const signatureData: SignatureData = calendarAuthenticationRecord.getSignatureData();

        return publicationsFile.findCertificateById(signatureData.getCertificateId()) === null
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_01)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
