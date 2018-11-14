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
 * Verifies that extender response calendar hash chain right link hash algorithms are not deprecated.
 */
export class ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    verify(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = context.getSignature();
            const userPublication = context.getUserPublication();
            let publicationData;
            if (userPublication !== null) {
                publicationData = userPublication;
            }
            else {
                const publicationsFile = context.getPublicationsFile();
                if (publicationsFile === null) {
                    throw new KsiVerificationError('Invalid publications file in context: null.');
                }
                const publicationRecord = publicationsFile
                    .getNearestPublicationRecord(signature.getAggregationTime());
                if (publicationRecord === null) {
                    return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
                }
                publicationData = publicationRecord.getPublicationData();
            }
            const extendedCalendarHashChain = yield context.getExtendedCalendarHashChain(publicationData.getPublicationTime());
            const deprecatedLink = VerificationRule.getCalendarHashChainDeprecatedAlgorithmLink(extendedCalendarHashChain);
            if (deprecatedLink !== null) {
                // tslint:disable-next-line:max-line-length
                console.debug(`Calendar hash chain contains deprecated aggregation algorithm at publication time. Algorithm: ${deprecatedLink.getValue().hashAlgorithm.name}; Publication time: ${publicationData.getPublicationTime()}.`);
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
            }
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        });
    }
}
