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
import { compareArrayEquals } from '../../../util/Array';
import { AggregationHashChain } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { Rfc3161Record } from '../../Rfc3161Record';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule verifies that aggregation hash chain index and RFC3161 record chain index match.
 * If RFC3161 record is not present then VerificationResultCode.Ok is returned.
 */
export class Rfc3161RecordChainIndexRule extends VerificationRule {
  constructor() {
    super('Rfc3161RecordChainIndexRule');
  }

  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

    if (rfc3161Record === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
    const rfc3161ChainIndex: bigInteger.BigInteger[] = rfc3161Record.getChainIndex();
    const aggregationChainIndex: bigInteger.BigInteger[] = aggregationHashChains[0].getChainIndex();

    if (!compareArrayEquals(rfc3161ChainIndex, aggregationChainIndex)) {
      console.debug(
        `Aggregation hash chain index and RFC3161 chain index mismatch. Aggregation chain index ${JSON.stringify(
          rfc3161ChainIndex
        )} and RFC3161 chain index is ${JSON.stringify(aggregationChainIndex)}.`
      );

      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_12());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
