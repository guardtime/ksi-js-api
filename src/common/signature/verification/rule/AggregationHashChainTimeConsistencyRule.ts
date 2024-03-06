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

import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result.js';
import bigInteger from 'big-integer';
import { AggregationHashChain } from '../../AggregationHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Rule checks that aggregation hash chain times are consistent. It means that previous aggregation hash chain
 * aggregation time equals to current one.
 */
export class AggregationHashChainTimeConsistencyRule extends VerificationRule {
  public constructor() {
    super('AggregationHashChainTimeConsistencyRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    let time: bigInteger.BigInteger | null = null;
    for (const chain of aggregationHashChains) {
      if (time === null) {
        time = chain.getAggregationTime();
      }

      if (!chain.getAggregationTime().equals(time)) {
        console.debug(
          `Previous aggregation hash chain aggregation time ${time} does not match current aggregation time ${chain.getAggregationTime()}.`,
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02());
      }
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
