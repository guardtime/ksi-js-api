var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export class CertificateExistenceRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarAuthenticationRecord = signature.getCalendarAuthenticationRecord();
            if (calendarAuthenticationRecord == null) {
                // TODO: Should it return NA?
                throw new KsiVerificationError('Invalid calendar authentication record: null');
            }
            const publicationsFile = context.getPublicationsFile();
            if (publicationsFile === null) {
                throw new KsiVerificationError('Invalid publications file in context: null.');
            }
            const signatureData = calendarAuthenticationRecord.getSignatureData();
            return publicationsFile.findCertificateById(signatureData.getCertificateId()) === null
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_01)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
