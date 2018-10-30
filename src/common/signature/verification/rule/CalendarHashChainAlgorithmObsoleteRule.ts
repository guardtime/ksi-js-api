import {LinkDirection} from '../../../Constants';
import {CalendarHashChain} from '../../CalendarHashChain';
import {IKsiSignature} from '../../IKsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Verifies that calendar hash chain right link hash algorithms were not obsolete at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmObsoleteRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: IKsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        for (const link of calendarHashChain.getChainLinks()) {
            if (link.id !== LinkDirection.Left) {
                continue;
            }

            if (link.getValue().hashAlgorithm.isObsolete(calendarHashChain.getPublicationTime().valueOf())) {
                console.log(`Calendar hash chain contains obsolete aggregation algorithm at publication time.
                             Algorithm: ${link.getValue().hashAlgorithm.name};
                             Publication time: ${calendarHashChain.getPublicationTime()}`);

                return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_16);
            }
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
