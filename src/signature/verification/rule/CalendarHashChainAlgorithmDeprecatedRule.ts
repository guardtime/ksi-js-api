import {LinkDirection} from '../../../Constants';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that calendar hash chain right link hash algorithms were not deprecated at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        for (const link of calendarHashChain.getChainLinks()) {
            if (link.id !== LinkDirection.Left) {
                continue;
            }

            if (link.getValue().hashAlgorithm.isDeprecated(calendarHashChain.getPublicationTime().valueOf())) {
                console.log(`Calendar hash chain contains deprecated aggregation algorithm at publication time.
                             Algorithm: ${link.getValue().hashAlgorithm.name};
                             Publication time: {calendarHashChain.getPublicationTime()}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02);
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
