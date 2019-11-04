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
 * Rule verifies that last aggregation hash chain output hash is equal to calendar hash chain input hash. If calendar
 * hash chain is missing, status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainInputHashVerificationRule extends VerificationRule {
    constructor() {
        super("CalendarHashChainInputHashVerificationRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            return !(yield signature.getLastAggregationHashChainRootHash()).equals(calendarHashChain.getInputHash())
                ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_03())
                : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
