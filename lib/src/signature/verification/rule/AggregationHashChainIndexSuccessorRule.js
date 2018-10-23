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
 * This rule checks that chain index of a aggregation hash chain is successor to it's parent aggregation hash chain index.
 */
export class AggregationHashChainIndexSuccessorRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = VerificationRule.getSignature(context);
            const aggregationHashChains = signature.getAggregationHashChains();
            let parentChainIndex = null;
            let chainIndex = null;
            for (const chain of aggregationHashChains) {
                chainIndex = chain.getChainIndex();
                if (parentChainIndex !== null && !(parentChainIndex.length !== chainIndex.length
                    || JSON.stringify(parentChainIndex).startsWith(JSON.stringify(chainIndex)))) {
                    // tslint:disable-next-line:max-line-length
                    console.log(`Chain index is not the successor to the parent aggregation hash chain index. Chain index: ${chainIndex}; Parent chain index: ${parentChainIndex}`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
                }
                parentChainIndex = chainIndex;
            }
            if (aggregationHashChains[aggregationHashChains.length - 1].getChainIndex().length !== 1) {
                console.log(`Highest aggregation hash chain index length is not 1. Chain index: ${chainIndex};`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
