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

import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import { BigInteger } from 'big-integer';
import { AggregationHashChain } from '../../AggregationHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Verifies that RFC3161 record output hash algorithm was not deprecated at the aggregation time.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
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
