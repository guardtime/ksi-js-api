/*
 * Copyright 2013-2020 Guardtime, Inc.
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

import { CalendarAuthenticationRecordExistenceRule } from '../rule/CalendarAuthenticationRecordExistenceRule.js';
import { CalendarAuthenticationRecordSignatureVerificationRule } from '../rule/CalendarAuthenticationRecordSignatureVerificationRule.js';
import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule.js';
import { CalendarHashChainExistenceRule } from '../rule/CalendarHashChainExistenceRule.js';
import { CertificateExistenceRule } from '../rule/CertificateExistenceRule.js';
import { InternalVerificationPolicy } from './InternalVerificationPolicy.js';
import { VerificationPolicy } from './VerificationPolicy.js';

/**
 * Policy for verifying KSI signature with PKI.
 */
export class KeyBasedVerificationPolicy extends VerificationPolicy {
  /**
   * Key based verification policy constructor.
   */
  public constructor() {
    super(
      new InternalVerificationPolicy().onSuccess(KeyBasedVerificationPolicy.CREATE_POLICY_WO_INTERNAL_POLICY()),
      'KeyBasedVerificationPolicy'
    );
  }

  public static CREATE_POLICY_WO_INTERNAL_POLICY(): VerificationPolicy {
    return new VerificationPolicy(
      new CalendarHashChainExistenceRule() // Gen-02
        .onSuccess(
          new CalendarHashChainAlgorithmDeprecatedRule() // Gen-02
            .onSuccess(
              new CalendarAuthenticationRecordExistenceRule() // Gen-02
                .onSuccess(
                  new CertificateExistenceRule() // Gen-02
                    .onSuccess(new CalendarAuthenticationRecordSignatureVerificationRule())
                )
            )
        ),
      'KeyBasedVerificationPolicy'
    );
  }
}
