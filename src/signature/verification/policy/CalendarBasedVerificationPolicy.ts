import bigInteger from 'big-integer';

import {DataHash} from 'gt-js-common';
import {AggregationHashChain} from '../../AggregationHashChain';
import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {KsiVerificationError} from '../KsiVerificationError';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';
import {VerificationPolicy} from './VerificationPolicy';
import {InternalVerificationPolicy} from './InternalVerificationPolicy';

/**
 * Rule checks that extended signature contains correct aggregation time.
 */
class ExtendedSignatureCalendarChainAggregationTimeRule extends VerificationRule {

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = VerificationRule.getSignature(context);
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        const extendedCalendarHashChain: CalendarHashChain = calendarHashChain == null
            ? context.getExtendedLatestCalendarHashChain()
            : context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());

        if (extendedCalendarHashChain === null) {
            throw new KsiVerificationError('Received invalid extended calendar hash chain from context extension function: null.');
        }

        const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();
        const aggregationTime: bigInteger.BigInteger = aggregationHashChains[aggregationHashChains.length - 1].getAggregationTime();

        return aggregationTime.equals(extendedCalendarHashChain.getAggregationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_03)
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }


//         ReadOnlyCollection<AggregationHashChain> aggregationHashChains = GetAggregationHashChains(signature, false);
//         ulong aggregationTime = aggregationHashChains[aggregationHashChains.Count - 1].AggregationTime;
//
//         return aggregationTime != extendedCalendarHashChain.AggregationTime
//             ? new VerificationResult(GetRuleName(), VerificationResultCode.Fail, VerificationError.Cal03)
//             : new VerificationResult(GetRuleName(), VerificationResultCode.Ok);
//     }
}

/**
 * Extended signature calendar hash chain input hash rule
 */
class ExtendedSignatureCalendarChainInputHashRule extends VerificationRule {
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

/**
 * Calendar based verification policy
 */
export class CalendarBasedVerificationPolicy extends VerificationPolicy {

    constructor() {
        super();

        const verificationRule: VerificationRule = new ExtendedSignatureCalendarChainInputHashRule() // Cal-02
            .onSuccess(new ExtendedSignatureCalendarChainAggregationTimeRule()); // Cal-03

        // this.firstRule = new InternalVerificationPolicy()
        //     .OnSuccess(new CalendarHashChainExistenceRule() // // Gen-02
        //         .OnSuccess(new SignaturePublicationRecordExistenceRule() // Gen-02
        //             .OnSuccess(new ExtendedSignatureCalendarChainRootHashRule() // Cal-01
        //                 .OnSuccess(verificationRule))
        //             .OnNa(new ExtendedSignatureCalendarHashChainRightLinksMatchRule() // Cal-4
        //                 .OnSuccess(verificationRule)))
        //         .OnNa(verificationRule));
    }
}
