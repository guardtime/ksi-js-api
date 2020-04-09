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

import { ResultCode as VerificationResultCode } from '@guardtime/gt-js-common/lib/verification/Result';
import { PublicationData } from '../../../publication/PublicationData';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * RRule checks that user provided publication hash matches extender response calendar hash chain root hash.
 */
export class UserProvidedPublicationHashMatchesExtendedResponseRule extends VerificationRule {
  constructor() {
    super('UserProvidedPublicationHashMatchesExtendedResponseRule');
  }

  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const userPublication: PublicationData | null = context.getUserPublication();
    if (userPublication === null) {
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('User publication is missing from context.'))
      );
    }

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain = await context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
    } catch (e) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02(e));
    }

    return !(await extendedCalendarHashChain.calculateOutputHash()).equals(userPublication.getPublicationHash())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_01())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
