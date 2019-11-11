import {HexCoder, X509} from '@guardtime/gt-js-common';
import {CertificateRecord} from '../../../publication/CertificateRecord';
import {PublicationsFile} from '../../../publication/PublicationsFile';
import {CalendarAuthenticationRecord} from '../../CalendarAuthenticationRecord';
import {CalendarHashChain} from '../../CalendarHashChain';
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
    constructor() {
        super("CalendarAuthenticationRecordSignatureVerificationRule");
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

        if (calendarAuthenticationRecord == null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
        if (publicationsFile === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    new KsiVerificationError('Publications file missing from context.')));
        }

        const signatureData: SignatureData = calendarAuthenticationRecord.getSignatureData();
        switch (signatureData.getSignatureType()) {
            case '1.2.840.113549.1.1.11':
                break;
            case '1.2.840.113549.1.7.2':
                throw new Error('Not implemented');
            default:
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02());
        }

        const certificateRecord: CertificateRecord | null = publicationsFile
            .findCertificateById(signatureData.getCertificateId());

        if (certificateRecord === null) {
            return new VerificationResult(
                this.getRuleName(),
                VerificationResultCode.NA,
                VerificationError.GEN_02(
                    // tslint:disable-next-line:max-line-length
                    new KsiVerificationError(`No certificate found in publications file with id: ${HexCoder.encode(signatureData.getCertificateId())}.`)));
        }

        if (!X509.isCertificateValidDuring(certificateRecord.getX509Certificate(), signature.getAggregationTime())) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_03());
        }

        const signedBytes: Uint8Array = calendarAuthenticationRecord.getPublicationData().encode();
        try {
            if (X509.verify(certificateRecord.getX509Certificate(), signedBytes, signatureData.getSignatureValue())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
        } catch (error) {
            console.debug(error);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02());
    }
}
