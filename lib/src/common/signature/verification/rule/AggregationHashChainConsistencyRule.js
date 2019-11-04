var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bigInteger from 'big-integer';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule verifies if all aggregation hash chains are consistent. e.g. previous aggregation hash chain output hash
 * equals to current aggregation hash chain input hash.
 */
export class AggregationHashChainConsistencyRule extends VerificationRule {
    constructor() {
        super("AggregationHashChainConsistencyRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            let chainHashResult = null;
            for (const chain of aggregationHashChains) {
                if (chainHashResult === null) {
                    chainHashResult = { level: bigInteger(0), hash: chain.getInputHash() };
                }
                if (!chain.getInputHash().equals(chainHashResult.hash)) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Aggregation hash chains not consistent. Aggregation hash chain input hash ${chain.getInputHash()} does not match previous aggregation hash chain output hash ${chainHashResult.hash}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01());
                }
                chainHashResult = yield chain.getOutputHash(chainHashResult);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
