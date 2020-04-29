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
import { PublicationsFile } from '../../../publication/PublicationsFile';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that publications file publication time matches with extender response calendar hash chain shape.
 */
export class PublicationsFilePublicationTimeMatchesExtenderResponseRule extends VerificationRule {
  public constructor() {
    super('PublicationsFilePublicationTimeMatchesExtenderResponseRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
    if (publicationsFile === null) {
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.'))
      );
    }

    const signature: KsiSignature = context.getSignature();
    const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(
      signature.getAggregationTime()
    );

    if (publicationRecord == null) {
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(
          new KsiVerificationError(
            `No publication record found after given time in publications file: ${signature.getAggregationTime()}.`
          )
        )
      );
    }

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain = await context.getExtendedCalendarHashChain(publicationRecord.getPublicationTime());
    } catch (e) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
    }

    if (publicationRecord.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02());
    }

    return signature.getAggregationTime().neq(extendedCalendarHashChain.calculateRegistrationTime())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
