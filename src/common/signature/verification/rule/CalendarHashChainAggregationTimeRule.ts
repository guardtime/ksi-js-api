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
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule verifies calendar hash chain aggregation time equality to last aggregation hash chain aggregation time.
 * Without calendar authentication record <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class CalendarHashChainAggregationTimeRule extends VerificationRule {
  public constructor() {
    super('CalendarHashChainAggregationTimeRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

    if (calendarHashChain === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();

    return aggregationHashChains[aggregationHashChains.length - 1]
      .getAggregationTime()
      .neq(calendarHashChain.getAggregationTime())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_04())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
