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
import { PublicationRecord } from '../../../publication/PublicationRecord';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks if KSI signature calendar hash chain publication hash matches signature publication record publication hash.
 * If publication record is missing, VerificationResultCode.Ok is returned.
 */
export class SignaturePublicationRecordPublicationHashRule extends VerificationRule {
  public constructor() {
    super('SignaturePublicationRecordPublicationHashRule');
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

    return !publicationRecord.getPublicationHash().equals(await calendarHashChain.calculateOutputHash())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_09())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
