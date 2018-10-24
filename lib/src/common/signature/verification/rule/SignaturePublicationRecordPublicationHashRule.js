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
 * Rule checks if KSI signature calendar hash chain publication hash matches signature publication record publication hash.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export class SignaturePublicationRecordPublicationHashRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = VerificationRule.getSignature(context);
            const publicationRecord = signature.getPublicationRecord();
            if (publicationRecord === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
            }
            return publicationRecord.getPublicationHash().equals(calendarHashChain.calculateOutputHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_09)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
