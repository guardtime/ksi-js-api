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
import { PublicationRecord } from '../../../publication/PublicationRecord';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks if KSI signature calendar hash chain publication time matches signature publication record publication time.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export class SignaturePublicationRecordPublicationTimeRule extends VerificationRule {
  public constructor() {
    super('SignaturePublicationRecordPublicationTimeRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();

    if (publicationRecord === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
    if (calendarHashChain === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    return publicationRecord.getPublicationTime().neq(calendarHashChain.getPublicationTime())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_07())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
