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
import * as ArrayUtils from '@guardtime/common/lib/utils/Array.js';
import { BigInteger } from 'big-integer';
import { AggregationHashChain } from '../../AggregationHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * This rule checks that chain index of an aggregation hash chain is successor to its parent aggregation hash chain index.
 */
export class AggregationHashChainIndexSuccessorRule extends VerificationRule {
  public constructor() {
    super('AggregationHashChainIndexSuccessorRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    let parentChainIndex: BigInteger[] | null = null;
    for (const chain of aggregationHashChains) {
      const chainIndex: BigInteger[] = chain.getChainIndex();
      if (
        parentChainIndex !== null &&
        (parentChainIndex.length <= chainIndex.length ||
          !ArrayUtils.compareArrayEquals(parentChainIndex.slice(0, chainIndex.length), chainIndex))
      ) {
        console.debug(
          `Chain index is not the successor to the parent aggregation hash chain index. Chain index: ${chainIndex}; Parent chain index: ${parentChainIndex}.`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
      }

      parentChainIndex = chainIndex;
    }

    if (aggregationHashChains[aggregationHashChains.length - 1].getChainIndex().length !== 1) {
      console.debug(
        `Highest aggregation hash chain index length is not 1. Chain index: ${aggregationHashChains[
          aggregationHashChains.length - 1
        ].getChainIndex()}.`
      );

      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
