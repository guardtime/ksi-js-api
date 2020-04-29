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
import { KsiVerificationError } from '../KsiVerificationError';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule for checking if KSI signature contains calendar hash chain. Used for key-based and publication-based verification policies.
 */
export class CalendarHashChainExistenceRule extends VerificationRule {
  public constructor() {
    super('CalendarHashChainExistenceRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    return context.getSignature().getCalendarHashChain() === null
      ? new VerificationResult(
          this.getRuleName(),
          VerificationResultCode.NA,
          VerificationError.GEN_02(new KsiVerificationError('Calendar hash chain is missing.'))
        )
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
