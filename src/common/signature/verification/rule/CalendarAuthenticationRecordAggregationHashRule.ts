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

import { ResultCode as VerificationResultCode } from '@guardtime/common';
import { CalendarAuthenticationRecord } from '../../CalendarAuthenticationRecord.js';
import { CalendarHashChain } from '../../CalendarHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Rule verifies that calendar authentication record publication hash equals to calendar hash chain output hash.
 * Without calendar authentication record, {@see VerificationResultCode.OK} is returned.
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
    const calendarAuthenticationRecord: CalendarAuthenticationRecord | null =
      signature.getCalendarAuthenticationRecord();

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
