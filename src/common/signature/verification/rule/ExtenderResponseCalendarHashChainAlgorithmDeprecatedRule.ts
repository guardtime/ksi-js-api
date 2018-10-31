import {ImprintTag} from '../../../parser/ImprintTag';
import {PublicationData} from '../../../publication/PublicationData';
import {PublicationRecord} from '../../../publication/PublicationRecord';
import {PublicationsFile} from '../../../publication/PublicationsFile';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that extender response calendar hash chain right link hash algorithms are not deprecated.
 */
export class ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const userPublication: PublicationData | null = context.getUserPublication();

        let publicationData: PublicationData;
        if (userPublication !== null) {
            publicationData = userPublication;
        } else {
            const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
            if (publicationsFile === null) {
                throw new KsiVerificationError('Invalid publications file in context: null.');
            }

            const publicationRecord: PublicationRecord | null = publicationsFile
                .getNearestPublicationRecord(signature.getAggregationTime());

            if (publicationRecord === null) {
                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
            }

            publicationData = publicationRecord.getPublicationData();
        }

        const extendedCalendarHashChain: CalendarHashChain =
            await context.getExtendedCalendarHashChain(publicationData.getPublicationTime());
        const deprecatedLink: ImprintTag | null = VerificationRule.getCalendarHashChainDeprecatedAlgorithmLink(extendedCalendarHashChain);
        if (deprecatedLink !== null) {
            console.warn(`Calendar hash chain contains deprecated aggregation algorithm at publication time.
                             Algorithm: ${deprecatedLink.getValue().hashAlgorithm.name};
                             Publication time: ${publicationData.getPublicationTime()}`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
