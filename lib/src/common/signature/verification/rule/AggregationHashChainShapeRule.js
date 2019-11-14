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
 * Rule checks that shape of the aggregation hash chain matches with chain index.
 */
export class AggregationHashChainShapeRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const aggregationHashChains = signature.getAggregationHashChains();
            for (const chain of aggregationHashChains) {
                const chainIndex = chain.getChainIndex();
                const calculatedValue = chain.calculateLocationPointer();
                const lastIndexValue = chainIndex[chainIndex.length - 1];
                if (!lastIndexValue.eq(calculatedValue)) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`The shape of the aggregation hash chain does not match with the chain index. Calculated location pointer: ${calculatedValue}; Value in chain: ${lastIndexValue}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_10());
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
