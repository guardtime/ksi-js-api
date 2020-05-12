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

import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import { ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule } from '../rule/ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule';
import { ExtendingPermittedVerificationRule } from '../rule/ExtendingPermittedVerificationRule';
import { PublicationsFileExtendedSignatureInputHashRule } from '../rule/PublicationsFileExtendedSignatureInputHashRule';
import { PublicationsFilePublicationHashMatchesExtenderResponseRule } from '../rule/PublicationsFilePublicationHashMatchesExtenderResponseRule';
import { PublicationsFilePublicationTimeMatchesExtenderResponseRule } from '../rule/PublicationsFilePublicationTimeMatchesExtenderResponseRule';
import { PublicationsFileSignaturePublicationMatchRule } from '../rule/PublicationsFileSignaturePublicationMatchRule';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule';
import { VerificationRule } from '../VerificationRule';
import { VerificationPolicy } from './VerificationPolicy';

/**
 * Policy for verifying KSI signature with publications file.
 */
export class PublicationsFileVerificationPolicy extends VerificationPolicy {
  /**
   * Publications file verification policy constructor.
   */
  public constructor() {
    const verificationRule: VerificationRule = new ExtendingPermittedVerificationRule() // Gen-02
      .onSuccess(
        new ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule() // Gen-02
          .onSuccess(
            new PublicationsFilePublicationHashMatchesExtenderResponseRule() // Pub-01,  Gen-02
              .onSuccess(
                new PublicationsFilePublicationTimeMatchesExtenderResponseRule() // Pub-02
                  .onSuccess(new PublicationsFileExtendedSignatureInputHashRule())
              )
          )
      ); // Pub-03

    super(
      new SignaturePublicationRecordExistenceRule() // Gen-02
        .onSuccess(
          new PublicationsFileSignaturePublicationMatchRule() // Pub-05, Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule()) // Gen-02
            .onNa(verificationRule)
        )
        .onNa(verificationRule),
      'PublicationsFileVerificationPolicy'
    );
  }
}
