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

import { ResultCode as VerificationResultCode } from '@guardtime/gt-js-common/lib/verification/Result';
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
  constructor() {
    super('AggregationHashChainAlgorithmDeprecatedRule');
  }

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
