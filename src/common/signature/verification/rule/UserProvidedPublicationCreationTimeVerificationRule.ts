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

import { ResultCode as VerificationResultCode } from '@guardtime/common';
import { BigInteger } from 'big-integer';
import { PublicationData } from '../../../publication/PublicationData.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Rule checks that signature is created before user provided publication.
 */
export class UserProvidedPublicationCreationTimeVerificationRule extends VerificationRule {
  public constructor() {
    super('UserProvidedPublicationCreationTimeVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const aggregationTime: BigInteger = context.getSignature().getAggregationTime();
    const userPublication: PublicationData | null = context.getUserPublication();

    if (userPublication == null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const userPublicationTime: BigInteger = userPublication.getPublicationTime();

    return aggregationTime.geq(userPublicationTime)
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
