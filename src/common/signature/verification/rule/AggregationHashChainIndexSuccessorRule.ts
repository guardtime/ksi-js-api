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
import { BigInteger } from 'big-integer';
import { compareArrayEquals } from '../../../util/Array';
import { AggregationHashChain } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule checks that chain index of a aggregation hash chain is successor to it's parent aggregation hash chain index.
 */
export class AggregationHashChainIndexSuccessorRule extends VerificationRule {
  constructor() {
    super('AggregationHashChainIndexSuccessorRule');
  }

  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    let parentChainIndex: BigInteger[] | null = null;
    for (const chain of aggregationHashChains) {
      const chainIndex: BigInteger[] = chain.getChainIndex();
      if (
        parentChainIndex !== null &&
        (parentChainIndex.length <= chainIndex.length ||
          !compareArrayEquals(parentChainIndex.slice(0, chainIndex.length), chainIndex))
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
