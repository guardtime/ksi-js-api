var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { compareArrayEquals } from '../../../util/Array';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * This rule verifies that aggregation hash chain index and RFC3161 record chain index match.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export class Rfc3161RecordChainIndexRule extends VerificationRule {
    constructor() {
        super("Rfc3161RecordChainIndexRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const rfc3161Record = signature.getRfc3161Record();
            if (rfc3161Record === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const aggregationHashChains = signature.getAggregationHashChains();
            const rfc3161ChainIndex = rfc3161Record.getChainIndex();
            const aggregationChainIndex = aggregationHashChains[0].getChainIndex();
            if (!compareArrayEquals(rfc3161ChainIndex, aggregationChainIndex)) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Aggregation hash chain index and RFC3161 chain index mismatch. Aggregation chain index ${JSON.stringify(rfc3161ChainIndex)} and RFC3161 chain index is ${JSON.stringify(aggregationChainIndex)}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
