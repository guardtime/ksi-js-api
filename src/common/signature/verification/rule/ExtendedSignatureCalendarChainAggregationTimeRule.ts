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
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
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
