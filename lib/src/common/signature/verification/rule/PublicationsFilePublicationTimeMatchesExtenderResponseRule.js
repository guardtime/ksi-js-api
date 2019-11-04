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
 * Rule checks that publications file publication time matches with extender response calendar hash chain shape.
 */
export class PublicationsFilePublicationTimeMatchesExtenderResponseRule extends VerificationRule {
    constructor() {
        super("PublicationsFilePublicationTimeMatchesExtenderResponseRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicationsFile = context.getPublicationsFile();
            if (publicationsFile === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.')));
            }
            const signature = context.getSignature();
            const publicationRecord = publicationsFile.getNearestPublicationRecord(signature.getAggregationTime());
            if (publicationRecord == null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, 
                // tslint:disable-next-line:max-line-length
                VerificationError.GEN_02(new KsiVerificationError(`No publication record found after given time in publications file: ${signature.getAggregationTime()}.`)));
            }
            let extendedCalendarHashChain = null;
            try {
                extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());
            }
            catch (e) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
            }
            if (publicationRecord.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02());
            }
            return signature.getAggregationTime().neq(extendedCalendarHashChain.calculateRegistrationTime())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
