/*
 * Copyright 2013-2019 Guardtime, Inc.
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

import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule';
import { InternalVerificationPolicy } from './InternalVerificationPolicy';
import { PublicationsFileVerificationPolicy } from './PublicationsFileVerificationPolicy';
import { UserProvidedPublicationBasedVerificationPolicy } from './UserProvidedPublicationBasedVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';

/**
 * Policy for verifying KSI signature with publication.
 */
export class PublicationBasedVerificationPolicy extends VerificationPolicy {
  /**
   * Publication based verification policy constructor.
   */
  public constructor() {
    super(
      new InternalVerificationPolicy().onSuccess(
        new UserProvidedPublicationExistenceRule() // Gen-02
          .onSuccess(new UserProvidedPublicationBasedVerificationPolicy()) // Gen-02
          .onNa(new PublicationsFileVerificationPolicy())
      ),
      'PublicationBasedVerificationPolicy'
    );
  }
}
