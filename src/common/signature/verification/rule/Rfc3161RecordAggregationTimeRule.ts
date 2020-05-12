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
import { Rfc3161Record } from '../../Rfc3161Record';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule verifies that aggregation hash chain aggregation time and RFC3161 record aggregation time match.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordAggregationTimeRule extends VerificationRule {
  public constructor() {
    super('Rfc3161RecordAggregationTimeRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

    if (rfc3161Record === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const aggregationHashChains: Readonly<AggregationHashChain[]> = signature.getAggregationHashChains();
    if (!aggregationHashChains[0].getAggregationTime().equals(rfc3161Record.getAggregationTime())) {
      console.debug(`Aggregation hash chain aggregation time and RFC 3161 aggregation time mismatch.`);

      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_02());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
