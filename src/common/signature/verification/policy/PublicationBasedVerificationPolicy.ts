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

import { InternalVerificationPolicy } from './InternalVerificationPolicy.js';
import { VerificationPolicy } from './VerificationPolicy.js';
import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule.js';
import { UserProvidedPublicationBasedVerificationPolicy } from './UserProvidedPublicationBasedVerificationPolicy.js';
import { PublicationsFileVerificationPolicy } from './PublicationsFileVerificationPolicy.js';

/**
 * Policy for verifying KSI signature with publication.
 */
export class PublicationBasedVerificationPolicy extends VerificationPolicy {
  /**
   * Publication based verification policy constructor.
   */
  public constructor() {
    super(
      new InternalVerificationPolicy().onSuccess(PublicationBasedVerificationPolicy.CREATE_POLICY_WO_INTERNAL_POLICY()),
      'PublicationBasedVerificationPolicy'
    );
  }

  public static CREATE_POLICY_WO_INTERNAL_POLICY(): VerificationPolicy {
    return new VerificationPolicy(
      new UserProvidedPublicationExistenceRule() // Gen-02
        .onSuccess(new UserProvidedPublicationBasedVerificationPolicy()) // Gen-02
        .onNa(new PublicationsFileVerificationPolicy()),
      'PublicationBasedVerificationPolicy'
    );
  }
}
