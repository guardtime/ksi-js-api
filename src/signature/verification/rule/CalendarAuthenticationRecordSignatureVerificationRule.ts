import {HexCoder, X509} from 'gt-js-common';
import {CertificateRecord} from '../../../publication/CertificateRecord';
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
 * Rule validates calendar authentication record signature. Signature is made from calendar authentication record
 * publication data. X.509 certificate is searched from publications file and when found, it is used to validate PKI
 * signature in calendar authentication record.
 */
export class CalendarAuthenticationRecordSignatureVerificationRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            throw new KsiVerificationError('Invalid publications file in context: null.');
        }

        const signatureData: SignatureData = calendarAuthenticationRecord.getSignatureData();
        const certificateRecord: CertificateRecord | null = publicationsFile
            .findCertificateById(signatureData.getCertificateId());

        if (certificateRecord === null) {
            throw new KsiVerificationError(`No certificate found in publications file with id:
                                            ${HexCoder.encode(signatureData.getCertificateId())}.`);
        }

        const signedBytes: Uint8Array = calendarAuthenticationRecord.getPublicationData().encode();
        try {
            if (X509.verify(certificateRecord.getX509Certificate(), signedBytes, signatureData.getSignatureValue())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
        } catch (error) {
            console.log(error);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_03);
    }
}
