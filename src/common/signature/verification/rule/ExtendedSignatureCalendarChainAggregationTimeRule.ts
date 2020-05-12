/*
 * Copyright 2013-2019 Guardtime, Inc.
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
import { AggregationHashChain } from '../../AggregationHashChain';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that extended signature contains correct aggregation time.
 */
export class ExtendedSignatureCalendarChainAggregationTimeRule extends VerificationRule {
  public constructor() {
    super('ExtendedSignatureCalendarChainAggregationTimeRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain =
        calendarHashChain == null
          ? await context.getExtendedLatestCalendarHashChain()
          : await context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
    } catch (e) {
      console.warn(`Calendar extending failed: ${e}`);
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const aggregationHashChains: AggregationHashChain[] = signature.getAggregationHashChains();
    const aggregationTime: bigInteger.BigInteger = aggregationHashChains[
      aggregationHashChains.length - 1
    ].getAggregationTime();

    return !aggregationTime.equals(extendedCalendarHashChain.getAggregationTime())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_03())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
