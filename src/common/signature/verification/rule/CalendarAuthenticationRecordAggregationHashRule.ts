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
import { CalendarAuthenticationRecord } from '../../CalendarAuthenticationRecord';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule verifies that calendar authentication record publication hash equals to calendar hash chain output hash.
 * Without calendar authentication record VerificationResultCode.Ok is returned.
 */
export class CalendarAuthenticationRecordAggregationHashRule extends VerificationRule {
  public constructor() {
    super('CalendarAuthenticationRecordAggregationHashRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

    if (calendarAuthenticationRecord == null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
    if (calendarHashChain === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    return !(await calendarHashChain.calculateOutputHash()).equals(
      calendarAuthenticationRecord.getPublicationData().getPublicationHash()
    )
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_08())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
