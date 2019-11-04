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
 * This rule verifies that aggregation hash chain aggregation time and RFC3161 record aggregation time match.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordAggregationTimeRule extends VerificationRule {
    constructor() {
        super("Rfc3161RecordAggregationTimeRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const rfc3161Record = signature.getRfc3161Record();
            if (rfc3161Record === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const aggregationHashChains = signature.getAggregationHashChains();
            if (!aggregationHashChains[0].getAggregationTime().equals(rfc3161Record.getAggregationTime())) {
                console.debug(`Aggregation hash chain aggregation time and RFC 3161 aggregation time mismatch.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02());
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
