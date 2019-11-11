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
 * This rule verifies that input hash algorithm is not deprecated at aggregation time.
 * If RFC3161 record is present then RFC3161 record input hash algorithm deprecation is checked.
 */
export class InputHashAlgorithmDeprecatedRule extends VerificationRule {
    constructor() {
        super("InputHashAlgorithmDeprecatedRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const inputHash = signature.getInputHash();
            if (inputHash.hashAlgorithm.isDeprecated(signature.getAggregationTime().valueOf())) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Input hash algorithm was deprecated at aggregation time. Algorithm: ${inputHash.hashAlgorithm.name}; Aggregation time: ${signature.getAggregationTime()}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_13());
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
