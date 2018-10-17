import {AggregationHashChainAlgorithmDeprecatedRule} from '../rule/AggregationHashChainAlgorithmDeprecatedRule';
import {AggregationHashChainConsistencyRule} from '../rule/AggregationHashChainConsistencyRule';
import {AggregationHashChainIndexSuccessorRule} from '../rule/AggregationHashChainIndexSuccessorRule';
import {AggregationHashChainMetadataRule} from '../rule/AggregationHashChainMetadataRule';
import {AggregationHashChainShapeRule} from '../rule/AggregationHashChainShapeRule';
import {AggregationHashChainTimeConsistencyRule} from '../rule/AggregationHashChainTimeConsistencyRule';
import {CalendarAuthenticationRecordAggregationHashRule} from '../rule/CalendarAuthenticationRecordAggregationHashRule';
import {CalendarAuthenticationRecordExistenceRule} from '../rule/CalendarAuthenticationRecordExistenceRule';
import {CalendarAuthenticationRecordPublicationTimeRule} from '../rule/CalendarAuthenticationRecordPublicationTimeRule';
import {CalendarHashChainAggregationTimeRule} from '../rule/CalendarHashChainAggregationTimeRule';
import {CalendarHashChainAlgorithmObsoleteRule} from '../rule/CalendarHashChainAlgorithmObsoleteRule';
import {CalendarHashChainExistenceRule} from '../rule/CalendarHashChainExistenceRule';
import {CalendarHashChainInputHashVerificationRule} from '../rule/CalendarHashChainInputHashVerificationRule';
import {CalendarHashChainRegistrationTimeRule} from '../rule/CalendarHashChainRegistrationTimeRule';
import {DocumentHashLevelVerificationRule} from '../rule/DocumentHashLevelVerificationRule';
import {DocumentHashVerificationRule} from '../rule/DocumentHashVerificationRule';
import {InputHashAlgorithmDeprecatedRule} from '../rule/InputHashAlgorithmDeprecatedRule';
import {InputHashAlgorithmVerificationRule} from '../rule/InputHashAlgorithmVerificationRule';
import {Rfc3161RecordAggregationTimeRule} from '../rule/Rfc3161RecordAggregationTimeRule';
import {Rfc3161RecordChainIndexRule} from '../rule/Rfc3161RecordChainIndexRule';
import {Rfc3161RecordHashAlgorithmDeprecatedRule} from '../rule/Rfc3161RecordHashAlgorithmDeprecatedRule';
import {Rfc3161RecordOutputHashAlgorithmDeprecatedRule} from '../rule/Rfc3161RecordOutputHashAlgorithmDeprecatedRule';
import {Rfc3161RecordOutputHashVerificationRule} from '../rule/Rfc3161RecordOutputHashVerificationRule';
import {SignaturePublicationRecordExistenceRule} from '../rule/SignaturePublicationRecordExistenceRule';
import {SignaturePublicationRecordPublicationHashRule} from '../rule/SignaturePublicationRecordPublicationHashRule';
import {SignaturePublicationRecordPublicationTimeRule} from '../rule/SignaturePublicationRecordPublicationTimeRule';
import {SuccessResultRule} from '../rule/SuccessResultRule';
import {VerificationRule} from '../VerificationRule';
import {VerificationPolicy} from './VerificationPolicy';

/**
 * Policy for verifying KSI signature internal consistency.
 */
export class InternalVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(InternalVerificationPolicy.verifyInput()
            .onSuccess(InternalVerificationPolicy.verifyRfc3161()
                .onSuccess(InternalVerificationPolicy.verifyAggregationChain()
                    .onSuccess(
                        // Verify calendar hash chain if exists
                        new CalendarHashChainExistenceRule() // Gen-02
                            .onSuccess(
                                InternalVerificationPolicy.verifyCalendarChain()
                                    .onSuccess(
                                        // Verify calendar auth record if exists
                                        new CalendarAuthenticationRecordExistenceRule() // Gen-02
                                            .onSuccess(new CalendarAuthenticationRecordPublicationTimeRule() // Int-06
                                                .onSuccess(new CalendarAuthenticationRecordAggregationHashRule()))
                                            // No calendar auth record. Verify publication record.
                                            .onNa(new SignaturePublicationRecordExistenceRule() // Gen-02
                                                .onSuccess(new SignaturePublicationRecordPublicationTimeRule() // Int-07
                                                    .onSuccess(new SignaturePublicationRecordPublicationHashRule())) // Int-09
                                                // No publication record
                                                .onNa(new SuccessResultRule())))))
                    // No calendar hash chain
                    .onNa(new SuccessResultRule()))));
    }

    private static verifyInput(): VerificationRule {
        return new VerificationPolicy(
            new InputHashAlgorithmVerificationRule() // Gen-04
                .onSuccess(new DocumentHashVerificationRule() // Gen-01
                    .onSuccess(new DocumentHashLevelVerificationRule() // Gen-03
                        .onSuccess(new InputHashAlgorithmDeprecatedRule())))); // Int-13)
    }

    private static verifyRfc3161(): VerificationRule {
        return new VerificationPolicy(
            new Rfc3161RecordHashAlgorithmDeprecatedRule() // Int-14
                .onSuccess(new Rfc3161RecordOutputHashAlgorithmDeprecatedRule() // Int-17
                    .onSuccess(new Rfc3161RecordChainIndexRule() // Int-12
                        .onSuccess(new Rfc3161RecordOutputHashVerificationRule() // Int-01
                            .onSuccess(new Rfc3161RecordAggregationTimeRule()))))); // Int-02
    }

    private static verifyAggregationChain(): VerificationRule {
        return new VerificationPolicy(new AggregationHashChainIndexSuccessorRule() // Int-12
            .onSuccess(new AggregationHashChainMetadataRule() // Int-11
                .onSuccess(new AggregationHashChainAlgorithmDeprecatedRule() // Int-15
                    .onSuccess(new AggregationHashChainConsistencyRule() // Int-01
                        .onSuccess(new AggregationHashChainTimeConsistencyRule() // Int-02
                            .onSuccess(new AggregationHashChainShapeRule())))))); // Int-10
    }

    private static verifyCalendarChain(): VerificationRule {
        return new VerificationPolicy(new CalendarHashChainInputHashVerificationRule() // Int-03
            .onSuccess(new CalendarHashChainAggregationTimeRule() // Int-04
                .onSuccess(new CalendarHashChainRegistrationTimeRule() // Int-05
                    .onSuccess(new CalendarHashChainAlgorithmObsoleteRule())))); // Int-16 // Int-10
    }
}
