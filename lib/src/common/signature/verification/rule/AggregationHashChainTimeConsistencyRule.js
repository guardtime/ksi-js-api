var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Rule checks that aggregation hash chain times are consistent. It means that previous aggregation hash chain
 * aggregation time equals to current one.
 */
export class AggregationHashChainTimeConsistencyRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            let time = null;
            for (const chain of aggregationHashChains) {
                if (time === null) {
                    time = chain.getAggregationTime();
                }
                if (!chain.getAggregationTime().equals(time)) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Previous aggregation hash chain aggregation time ${time} does not match current aggregation time ${chain.getAggregationTime()}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02());
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
