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
 * This rule verifies input hash algorithm. If RFC3161 record is present then intput hash algorithm must equal
 * to RFC3161 record input hash algorithm. Otherwise input hash algorithm is compared to aggregation hash chain input hash algorithm.
 * If input hash is not provided then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class InputHashAlgorithmVerificationRule extends VerificationRule {
    constructor() {
        super("InputHashAlgorithmVerificationRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const documentHash = context.getDocumentHash();
            if (documentHash === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const inputHash = signature.getInputHash();
            if (documentHash.hashAlgorithm !== inputHash.hashAlgorithm) {
                console.debug(`Wrong input hash algorithm. Expected ${documentHash.hashAlgorithm}, found ${inputHash.hashAlgorithm}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_04());
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
