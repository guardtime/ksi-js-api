var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that calendar hash chain right link hash algorithms were not deprecated at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    constructor() {
        super("CalendarHashChainAlgorithmDeprecatedRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            const deprecatedLink = VerificationRule.getCalendarHashChainDeprecatedAlgorithmLink(calendarHashChain);
            if (deprecatedLink !== null) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Calendar hash chain contains deprecated aggregation algorithm at publication time. Algorithm: ${deprecatedLink.getValue().hashAlgorithm.name}; Publication time: ${calendarHashChain.getPublicationTime()}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain right links has deprecated links.')));
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
