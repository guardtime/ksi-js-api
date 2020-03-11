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

import { BigInteger } from 'big-integer';
import { AggregationHashChain } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult, VerificationResultCode } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that shape of the aggregation hash chain matches with chain index.
 */
export class AggregationHashChainShapeRule extends VerificationRule {
  constructor() {
    super('AggregationHashChainShapeRule');
  }

  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    for (const chain of aggregationHashChains) {
      const chainIndex: BigInteger[] = chain.getChainIndex();
      const calculatedValue: BigInteger = chain.calculateLocationPointer();
      const lastIndexValue: BigInteger = chainIndex[chainIndex.length - 1];

      if (!lastIndexValue.eq(calculatedValue)) {
        console.debug(
          `The shape of the aggregation hash chain does not match with the chain index. Calculated location pointer: ${calculatedValue}; Value in chain: ${lastIndexValue}.`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_10());
      }
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
