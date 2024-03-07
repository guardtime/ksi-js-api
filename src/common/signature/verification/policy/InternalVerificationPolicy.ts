/*
 * Copyright 2013-2022 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import { AggregationHashChainAlgorithmDeprecatedRule } from '../rule/AggregationHashChainAlgorithmDeprecatedRule.js';
import { AggregationHashChainConsistencyRule } from '../rule/AggregationHashChainConsistencyRule.js';
import { AggregationHashChainIndexSuccessorRule } from '../rule/AggregationHashChainIndexSuccessorRule.js';
import { AggregationHashChainMetadataRule } from '../rule/AggregationHashChainMetadataRule.js';
import { AggregationHashChainShapeRule } from '../rule/AggregationHashChainShapeRule.js';
import { AggregationHashChainTimeConsistencyRule } from '../rule/AggregationHashChainTimeConsistencyRule.js';
import { CalendarAuthenticationRecordAggregationHashRule } from '../rule/CalendarAuthenticationRecordAggregationHashRule.js';
import { CalendarAuthenticationRecordExistenceRule } from '../rule/CalendarAuthenticationRecordExistenceRule.js';
import { CalendarAuthenticationRecordPublicationTimeRule } from '../rule/CalendarAuthenticationRecordPublicationTimeRule.js';
import { CalendarHashChainAggregationTimeRule } from '../rule/CalendarHashChainAggregationTimeRule.js';
import { CalendarHashChainAlgorithmObsoleteRule } from '../rule/CalendarHashChainAlgorithmObsoleteRule.js';
import { CalendarHashChainExistenceRule } from '../rule/CalendarHashChainExistenceRule.js';
import { CalendarHashChainInputHashVerificationRule } from '../rule/CalendarHashChainInputHashVerificationRule.js';
import { CalendarHashChainRegistrationTimeRule } from '../rule/CalendarHashChainRegistrationTimeRule.js';
import { DocumentHashLevelVerificationRule } from '../rule/DocumentHashLevelVerificationRule.js';
import { DocumentHashVerificationRule } from '../rule/DocumentHashVerificationRule.js';
import { InputHashAlgorithmDeprecatedRule } from '../rule/InputHashAlgorithmDeprecatedRule.js';
import { InputHashAlgorithmVerificationRule } from '../rule/InputHashAlgorithmVerificationRule.js';
import { Rfc3161RecordAggregationTimeRule } from '../rule/Rfc3161RecordAggregationTimeRule.js';
import { Rfc3161RecordChainIndexRule } from '../rule/Rfc3161RecordChainIndexRule.js';
import { Rfc3161RecordHashAlgorithmDeprecatedRule } from '../rule/Rfc3161RecordHashAlgorithmDeprecatedRule.js';
import { Rfc3161RecordOutputHashAlgorithmDeprecatedRule } from '../rule/Rfc3161RecordOutputHashAlgorithmDeprecatedRule.js';
import { Rfc3161RecordOutputHashVerificationRule } from '../rule/Rfc3161RecordOutputHashVerificationRule.js';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule.js';
import { SignaturePublicationRecordPublicationHashRule } from '../rule/SignaturePublicationRecordPublicationHashRule.js';
import { SignaturePublicationRecordPublicationTimeRule } from '../rule/SignaturePublicationRecordPublicationTimeRule.js';
import { SuccessResultRule } from '../rule/SuccessResultRule.js';
import { VerificationRule } from '../VerificationRule.js';
import { VerificationPolicy } from './VerificationPolicy.js';

/**
 * Policy for verifying KSI signature internal consistency.
 */
export class InternalVerificationPolicy extends VerificationPolicy {
  /**
   * Policy for verifying KSI signature internal consistency constructor.
   */
  public constructor() {
    super(
      InternalVerificationPolicy.verifyInput().onSuccess(
        InternalVerificationPolicy.verifyRfc3161().onSuccess(
          InternalVerificationPolicy.verifyAggregationChain().onSuccess(
            // Verify calendar hash chain if exists
            new CalendarHashChainExistenceRule() // Gen-02
              .onSuccess(
                InternalVerificationPolicy.verifyCalendarChain().onSuccess(
                  // Verify calendar auth record if exists
                  new CalendarAuthenticationRecordExistenceRule() // Gen-02
                    .onSuccess(
                      new CalendarAuthenticationRecordPublicationTimeRule() // Int-06
                        .onSuccess(new CalendarAuthenticationRecordAggregationHashRule()),
                    )
                    // No calendar auth record. Verify publication record.
                    .onNa(
                      new SignaturePublicationRecordExistenceRule() // Gen-02
                        .onSuccess(
                          new SignaturePublicationRecordPublicationTimeRule() // Int-07
                            .onSuccess(new SignaturePublicationRecordPublicationHashRule()),
                        ) // Int-09
                        // No publication record
                        .onNa(new SuccessResultRule()),
                    ),
                ),
              )
              // No calendar hash chain
              .onNa(new SuccessResultRule()),
          ),
        ),
      ),
      'InternalVerificationPolicy',
    );
  }

  /**
   * Verify user input rules.
   * @returns User input rules chain.
   */
  private static verifyInput(): VerificationRule {
    return new VerificationPolicy(
      new InputHashAlgorithmVerificationRule() // Gen-04
        .onSuccess(
          new DocumentHashVerificationRule() // Gen-01
            .onSuccess(
              new DocumentHashLevelVerificationRule() // Gen-03
                .onSuccess(new InputHashAlgorithmDeprecatedRule()),
            ),
        ),
      'Verify Input',
    ); // Int-13)
  }

  /**
   * Verify RFC3161 rules.
   * @returns RFC3161 rules chain.
   */
  private static verifyRfc3161(): VerificationRule {
    return new VerificationPolicy(
      new Rfc3161RecordHashAlgorithmDeprecatedRule() // Int-14
        .onSuccess(
          new Rfc3161RecordOutputHashAlgorithmDeprecatedRule() // Int-17
            .onSuccess(
              new Rfc3161RecordChainIndexRule() // Int-12
                .onSuccess(
                  new Rfc3161RecordOutputHashVerificationRule() // Int-01
                    .onSuccess(new Rfc3161RecordAggregationTimeRule()),
                ),
            ),
        ),
      'Verify Rfc3161',
    ); // Int-02
  }

  /**
   * Verify aggregation hash chain rules.
   * @returns Aggregation hash chain rule chain.
   */
  private static verifyAggregationChain(): VerificationRule {
    return new VerificationPolicy(
      new AggregationHashChainIndexSuccessorRule() // Int-12
        .onSuccess(
          new AggregationHashChainMetadataRule() // Int-11
            .onSuccess(
              new AggregationHashChainAlgorithmDeprecatedRule() // Int-15
                .onSuccess(
                  new AggregationHashChainConsistencyRule() // Int-01
                    .onSuccess(
                      new AggregationHashChainTimeConsistencyRule() // Int-02
                        .onSuccess(new AggregationHashChainShapeRule()),
                    ),
                ),
            ),
        ),
      'Verify aggregation hash chain',
    ); // Int-10
  }

  /**
   * Verify calendar hash chain rules.
   * @returns Calendar hash chain rules.
   */
  private static verifyCalendarChain(): VerificationRule {
    return new VerificationPolicy(
      new CalendarHashChainInputHashVerificationRule() // Int-03
        .onSuccess(
          new CalendarHashChainAggregationTimeRule() // Int-04
            .onSuccess(
              new CalendarHashChainRegistrationTimeRule() // Int-05
                .onSuccess(new CalendarHashChainAlgorithmObsoleteRule()),
            ),
        ),
      'Verify calendar hash chain',
    ); // Int-16 // Int-10
  }
}
