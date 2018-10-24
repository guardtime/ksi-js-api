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
 * Verifies that RFC3161 record output hash algorithm was not deprecated at the aggregation time.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordOutputHashAlgorithmDeprecatedRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = VerificationRule.getSignature(context);
            if (signature.getRfc3161Record() === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const aggregationHashChain = signature.getAggregationHashChains()[0];
            const hashAlgorithm = aggregationHashChain.getInputHash().hashAlgorithm;
            const aggregationTime = aggregationHashChain.getAggregationTime();
            if (hashAlgorithm.isDeprecated(aggregationTime.valueOf())) {
                // tslint:disable-next-line:max-line-length
                console.log(`RFC3161 output hash algorithm was deprecated at aggregation time. Algorithm: ${hashAlgorithm}; Aggregation time: ${aggregationTime}`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_17);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
