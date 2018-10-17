import {DataHash} from 'gt-js-common';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Extended signature calendar hash chain input hash rule
 */
export class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
        const extendedCalendarHashChain: CalendarHashChain = calendarHashChain == null
            ? context.getExtendedLatestCalendarHashChain()
            : context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());

        if (extendedCalendarHashChain === null) {
            throw new KsiVerificationError('Received invalid extended calendar hash chain from context extension function: null.');
        }

        const lastAggregationHashChainRootHash: DataHash = await signature.getLastAggregationHashChainRootHash();

        return !lastAggregationHashChainRootHash.equals(extendedCalendarHashChain.getInputHash())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_02)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
