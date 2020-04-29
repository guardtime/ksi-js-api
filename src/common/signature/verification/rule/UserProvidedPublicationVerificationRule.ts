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
import { PublicationData } from '../../../publication/PublicationData';
import { PublicationRecord } from '../../../publication/PublicationRecord';
import { KsiSignature } from '../../KsiSignature';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that user provided publication equals to publication in KSI signature.
 */
export class UserProvidedPublicationVerificationRule extends VerificationRule {
  public constructor() {
    super('UserProvidedPublicationVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const userPublication: PublicationData | null = context.getUserPublication();
    if (userPublication === null) {
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.'))
      );
    }

    const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
    if (publicationRecord === null) {
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('Publications record is missing from signature.'))
      );
    }

    if (userPublication.getPublicationTime().neq(publicationRecord.getPublicationTime())) {
      console.debug(
        `User provided publication time does not equal to signature publication time. User provided publication time: ${userPublication.getPublicationTime()}; Signature publication time: ${publicationRecord.getPublicationTime()}.`
      );

      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(
          new KsiVerificationError('User publication publication time is not equal to signature publication time.')
        )
      );
    }

    return !userPublication.getPublicationHash().equals(publicationRecord.getPublicationHash())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_04())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
