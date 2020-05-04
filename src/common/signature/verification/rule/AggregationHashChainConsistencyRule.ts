/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
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
 * Rule verifies if all aggregation hash chains are consistent. e.g. previous aggregation hash chain output hash
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
          `Aggregation hash chains not consistent. Aggregation hash chain input hash ${chain.getInputHash().toString()} does not match previous aggregation hash chain output hash ${
            chainHashResult.hash.toString()
          }.`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01());
      }

      chainHashResult = await chain.getOutputHash(chainHashResult);
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
