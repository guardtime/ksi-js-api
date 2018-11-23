var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HexCoder, X509 } from 'gt-js-common';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule validates calendar authentication record signature. Signature is made from calendar authentication record
 * publication data. X.509 certificate is searched from publications file and when found, it is used to validate PKI
 * signature in calendar authentication record.
 */
export class CalendarAuthenticationRecordSignatureVerificationRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarAuthenticationRecord = signature.getCalendarAuthenticationRecord();
            if (calendarAuthenticationRecord == null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const publicationsFile = context.getPublicationsFile();
            if (publicationsFile === null) {
                throw new KsiVerificationError('Invalid publications file in context: null.');
            }
            const signatureData = calendarAuthenticationRecord.getSignatureData();
            switch (signatureData.getSignatureType()) {
                case '1.2.840.113549.1.1.11':
                    break;
                case '1.2.840.113549.1.7.2':
                    throw new Error('Not implemented');
                default:
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02);
            }
            const certificateRecord = publicationsFile
                .findCertificateById(signatureData.getCertificateId());
            if (certificateRecord === null) {
                // tslint:disable-next-line:max-line-length
                throw new KsiVerificationError(`No certificate found in publications file with id: ${HexCoder.encode(signatureData.getCertificateId())}.`);
            }
            if (!X509.isCertificateValidDuring(certificateRecord.getX509Certificate(), signature.getAggregationTime())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_03);
            }
            const signedBytes = calendarAuthenticationRecord.getPublicationData().encode();
            try {
                if (X509.verify(certificateRecord.getX509Certificate(), signedBytes, signatureData.getSignatureValue())) {
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
                }
            }
            catch (error) {
                console.debug(error);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02);
        });
    }
}
