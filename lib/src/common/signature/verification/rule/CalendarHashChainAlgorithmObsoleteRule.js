var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LinkDirection } from '../../../Constants';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';
/**
 * Verifies that calendar hash chain right link hash algorithms were not obsolete at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmObsoleteRule extends VerificationRule {
    constructor() {
        super("CalendarHashChainAlgorithmObsoleteRule");
    }
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const calendarHashChain = signature.getCalendarHashChain();
            if (calendarHashChain === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
            }
            for (const link of calendarHashChain.getChainLinks()) {
                if (link.id !== LinkDirection.Left) {
                    continue;
                }
                if (link.getValue().hashAlgorithm.isObsolete(calendarHashChain.getPublicationTime().valueOf())) {
                    // tslint:disable-next-line:max-line-length
                    console.debug(`Calendar hash chain contains obsolete aggregation algorithm at publication time. Algorithm: ${link.getValue().hashAlgorithm.name}; Publication time: ${calendarHashChain.getPublicationTime()}.`);
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_16());
                }
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
