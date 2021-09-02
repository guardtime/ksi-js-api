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

import { ResultCode as VerificationResultCode, HashAlgorithm } from '@guardtime/common';
import { BigInteger } from 'big-integer';
import { AggregationHashChain } from '../../AggregationHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Verifies that RFC3161 record output hash algorithm was not deprecated at the aggregation time.
 * If RFC3161 record is not present, {@see VerificationResultCode.OK} is returned.
 */
export class Rfc3161RecordOutputHashAlgorithmDeprecatedRule extends VerificationRule {
  public constructor() {
    super('Rfc3161RecordOutputHashAlgorithmDeprecatedRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();

    if (signature.getRfc3161Record() === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const aggregationHashChain: AggregationHashChain = signature.getAggregationHashChains()[0];
    const hashAlgorithm: HashAlgorithm = aggregationHashChain.getInputHash().hashAlgorithm;
    const aggregationTime: BigInteger = aggregationHashChain.getAggregationTime();

    if (hashAlgorithm.isDeprecated(aggregationTime.valueOf())) {
      console.debug(
        `RFC3161 output hash algorithm was deprecated at aggregation time. Algorithm: ${hashAlgorithm}; Aggregation time: ${aggregationTime}.`
      );

      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_17());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
