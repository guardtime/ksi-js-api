var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies document hash. If RFC3161 record is present then document hash must equal to RFC3161 record input hash.
 * Otherwise document hash is compared to aggregation hash chain input hash.
 * If document hash is not provided then VerificationResultCode.Ok is returned.
 */
export class DocumentHashVerificationRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const documentHash = context.getDocumentHash();
            if (documentHash === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const inputHash = signature.getInputHash();
            if (!documentHash.equals(inputHash)) {
                console.debug(`Invalid document hash. Expected ${documentHash}, found ${inputHash}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_01);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
