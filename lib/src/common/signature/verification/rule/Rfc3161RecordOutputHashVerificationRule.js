var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataHasher } from 'gt-js-common';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies RFC3161 output hash equals to aggregation chain input hash.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordOutputHashVerificationRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const rfc3161Record = signature.getRfc3161Record();
            if (rfc3161Record === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const aggregationHashChainInputHash = signature.getAggregationHashChains()[0].getInputHash();
            const inputHash = yield new DataHasher(aggregationHashChainInputHash.hashAlgorithm)
                .update((yield rfc3161Record.getOutputHash()).imprint)
                .digest();
            return !inputHash.equals(aggregationHashChainInputHash)
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01)
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
