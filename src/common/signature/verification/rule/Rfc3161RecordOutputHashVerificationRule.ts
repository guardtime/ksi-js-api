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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import DataHasher from '@guardtime/common/lib/hash/DataHasher';
import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import { KsiSignature } from '../../KsiSignature';
import { Rfc3161Record } from '../../Rfc3161Record';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule verifies RFC3161 output hash equals to aggregation chain input hash.
 * If RFC3161 record is not present, {@see VerificationResultCode.OK} is returned.
 */
export class Rfc3161RecordOutputHashVerificationRule extends VerificationRule {
  public constructor() {
    super('Rfc3161RecordOutputHashVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

    if (rfc3161Record === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const aggregationHashChainInputHash: DataHash = signature.getAggregationHashChains()[0].getInputHash();
    const inputHash: DataHash = await new DataHasher(aggregationHashChainInputHash.hashAlgorithm)
      .update((await rfc3161Record.getOutputHash()).imprint)
      .digest();

    return !inputHash.equals(aggregationHashChainInputHash)
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
