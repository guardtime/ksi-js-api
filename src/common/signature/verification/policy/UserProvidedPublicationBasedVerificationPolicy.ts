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

import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule.js';
import { ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule } from '../rule/ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule.js';
import { ExtendingPermittedVerificationRule } from '../rule/ExtendingPermittedVerificationRule.js';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule.js';
import { UserProvidedPublicationCreationTimeVerificationRule } from '../rule/UserProvidedPublicationCreationTimeVerificationRule.js';
import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule.js';
import { UserProvidedPublicationExtendedSignatureInputHashRule } from '../rule/UserProvidedPublicationExtendedSignatureInputHashRule.js';
import { UserProvidedPublicationHashMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationHashMatchesExtendedResponseRule.js';
import { UserProvidedPublicationTimeMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationTimeMatchesExtendedResponseRule.js';
import { UserProvidedPublicationVerificationRule } from '../rule/UserProvidedPublicationVerificationRule.js';
import { VerificationRule } from '../VerificationRule.js';
import { VerificationPolicy } from './VerificationPolicy.js';

/**
 * Policy for verifying KSI signature with user provided publication.
 */
export class UserProvidedPublicationBasedVerificationPolicy extends VerificationPolicy {
  /**
   * User provided publication based verification policy.
   */
  public constructor() {
    const verificationRule: VerificationRule = new UserProvidedPublicationCreationTimeVerificationRule() // Gen-02
      .onSuccess(
        new ExtendingPermittedVerificationRule() // Gen-02
          .onSuccess(
            new ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule() // Gen-02
              .onSuccess(
                new UserProvidedPublicationHashMatchesExtendedResponseRule() // Pub-01
                  .onSuccess(
                    new UserProvidedPublicationTimeMatchesExtendedResponseRule() // Pub-02
                      .onSuccess(new UserProvidedPublicationExtendedSignatureInputHashRule())
                  )
              )
          )
      );

    super(
      new UserProvidedPublicationExistenceRule() // Gen-02
        .onSuccess(
          new SignaturePublicationRecordExistenceRule() // Gen-02
            .onSuccess(
              new UserProvidedPublicationVerificationRule() // Pub-04, Gen-02
                .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule()) // Gen-02
                .onNa(verificationRule)
            )
            .onNa(verificationRule)
        ),
      'UserProvidedPublicationBasedVerificationPolicy'
    ); // Pub-03
  }
}
