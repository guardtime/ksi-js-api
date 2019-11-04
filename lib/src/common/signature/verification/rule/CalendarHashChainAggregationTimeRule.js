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
 * Rule verifies calendar hash chain aggregation time equality to last aggregation hash chain aggregation time.
 * Without calendar authentication record <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class CalendarHashChainAggregationTimeRule extends VerificationRule {
    constructor() {
        super("CalendarHashChainAggregationTimeRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const aggregationHashChains = signature.getAggregationHashChains();
            return aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime().neq(calendarHashChain.getAggregationTime())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_04())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
