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
import bigInteger from 'big-integer';
import { AggregationHashChain, AggregationHashResult } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule verifies if all aggregation hash chains are consistent, e.g. previous aggregation hash chain output hash
 * equals to current aggregation hash chain input hash.
 */
export class AggregationHashChainConsistencyRule extends VerificationRule {
  public constructor() {
    super('AggregationHashChainConsistencyRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    let chainHashResult: AggregationHashResult | null = null;
    for (const chain of aggregationHashChains) {
      if (chainHashResult === null) {
        chainHashResult = { level: bigInteger(0), hash: chain.getInputHash() };
      }

      if (!chain.getInputHash().equals(chainHashResult.hash)) {
        console.debug(
          `Aggregation hash chains not consistent. Aggregation hash chain input hash ${chain.getInputHash()} does not match previous aggregation hash chain output hash ${
            chainHashResult.hash
          }.`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01());
      }

      chainHashResult = await chain.getOutputHash(chainHashResult);
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
