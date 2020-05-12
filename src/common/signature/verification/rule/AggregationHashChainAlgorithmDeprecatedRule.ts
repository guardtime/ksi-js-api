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

import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import { AggregationHashChain } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Verifies that aggregation hash chains use hash algorithms that were not deprecated at the aggregation time.
 */
export class AggregationHashChainAlgorithmDeprecatedRule extends VerificationRule {
  public constructor() {
    super('AggregationHashChainAlgorithmDeprecatedRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    for (const chain of aggregationHashChains) {
      if (chain.getAggregationAlgorithm().isDeprecated(chain.getAggregationTime().valueOf())) {
        console.debug(
          `Aggregation hash chain aggregation algorithm was deprecated at aggregation time. Algorithm: ${
            chain.getAggregationAlgorithm().name
          }; Aggregation time: ${chain.getAggregationTime()}.s`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_15());
      }
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
