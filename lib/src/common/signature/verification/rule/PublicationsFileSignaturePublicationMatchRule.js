var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks if publications file and signature publication record match.
 */
export class PublicationsFileSignaturePublicationMatchRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicationsFile = context.getPublicationsFile();
            if (publicationsFile === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.')));
            }
            const signature = context.getSignature();
            const publicationRecord = signature.getPublicationRecord();
            if (publicationRecord == null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Publications record is missing from signature.')));
            }
            const publicationRecordInPublicationFile = publicationsFile
                .getNearestPublicationRecord(publicationRecord.getPublicationTime());
            if (publicationRecordInPublicationFile === null
                || publicationRecordInPublicationFile.getPublicationTime().neq(publicationRecord.getPublicationTime())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Publications file publication record is missing.')));
            }
            return !publicationRecordInPublicationFile.getPublicationHash().equals(publicationRecord.getPublicationHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_05())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
