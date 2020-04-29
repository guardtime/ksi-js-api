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
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks that user provided publication time matches extender response calendar hash chain shape.
 */
export class UserProvidedPublicationTimeMatchesExtendedResponseRule extends VerificationRule {
  constructor() {
    super('UserProvidedPublicationTimeMatchesExtendedResponseRule');
  }

  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const userPublication: PublicationData | null = context.getUserPublication();
    if (userPublication === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain = await context.getExtendedCalendarHashChain(userPublication.getPublicationTime());
    } catch (e) {
      console.warn(e);
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    if (userPublication.getPublicationTime().neq(extendedCalendarHashChain.getPublicationTime())) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02());
    }

    return !signature.getAggregationTime().equals(await extendedCalendarHashChain.calculateRegistrationTime())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_02())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
