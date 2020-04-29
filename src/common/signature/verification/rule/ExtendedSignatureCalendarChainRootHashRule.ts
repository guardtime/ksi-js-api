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
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that extender response calendar hash chain (extension request with current calendar hash chain
 * aggregation and publication time is used) matches with current calendar hash chain root hash. If current signature
 * does not contain calendar hash chain, VerificationResultCode.Ok is returned.
 */
export class ExtendedSignatureCalendarChainRootHashRule extends VerificationRule {
  public constructor() {
    super('ExtendedSignatureCalendarChainRootHashRule');
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
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain is missing from signature.'))
      );
    }

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain = await context.getExtendedCalendarHashChain(calendarHashChain.getPublicationTime());
    } catch (e) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
    }

    return !(await calendarHashChain.calculateOutputHash()).equals(
      await extendedCalendarHashChain.calculateOutputHash()
    )
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.CAL_01())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
