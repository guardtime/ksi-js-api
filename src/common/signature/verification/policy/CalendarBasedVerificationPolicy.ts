import {CalendarHashChainExistenceRule} from '../rule/CalendarHashChainExistenceRule';
import {ExtendedSignatureCalendarChainAggregationTimeRule} from '../rule/ExtendedSignatureCalendarChainAggregationTimeRule';
import {ExtendedSignatureCalendarChainInputHashRule} from '../rule/ExtendedSignatureCalendarChainInputHashRule';
import {ExtendedSignatureCalendarChainRootHashRule} from '../rule/ExtendedSignatureCalendarChainRootHashRule';
import {ExtendedSignatureCalendarHashChainRightLinksMatchRule} from '../rule/ExtendedSignatureCalendarHashChainRightLinksMatchRule';
import {SignaturePublicationRecordExistenceRule} from '../rule/SignaturePublicationRecordExistenceRule';
import {VerificationRule} from '../VerificationRule';
import {InternalVerificationPolicy} from './InternalVerificationPolicy';
import {VerificationPolicy} from './VerificationPolicy';

/**
 * Calendar based verification policy
 */
export class CalendarBasedVerificationPolicy extends VerificationPolicy {

    constructor() {
        const verificationRule: VerificationRule = new ExtendedSignatureCalendarChainInputHashRule() // Cal-02
            .onSuccess(new ExtendedSignatureCalendarChainAggregationTimeRule()); // Cal-03

        super(new InternalVerificationPolicy()
            .onSuccess(new CalendarHashChainExistenceRule() // // Gen-02
                .onSuccess(new SignaturePublicationRecordExistenceRule() // Gen-02
                    .onSuccess(new ExtendedSignatureCalendarChainRootHashRule() // Cal-01
                        .onSuccess(verificationRule))
                    .onNa(new ExtendedSignatureCalendarHashChainRightLinksMatchRule() // Cal-4
                        .onSuccess(verificationRule)))
                .onNa(verificationRule)),
            "CalendarBasedVerificationPolicy");
    }
}
