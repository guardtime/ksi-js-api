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

import { Rule } from '@guardtime/common/lib/verification/Rule';
import { LinkDirection } from '../../Constants';
import { ImprintTag } from '../../parser/ImprintTag';
import { CalendarHashChain } from '../CalendarHashChain';
import { KsiSignature } from '../KsiSignature';
import { KsiVerificationError } from './KsiVerificationError';
import { VerificationContext } from './VerificationContext';
import { VerificationError } from './VerificationError';

/**
 * Verification Rule for KSI Signature
 */
export abstract class VerificationRule extends Rule<VerificationContext, VerificationError> {
  protected static getSignature(context: VerificationContext): KsiSignature {
    if (!context.getSignature()) {
      throw new KsiVerificationError('Invalid KSI signature in context: null.');
    }

    return context.getSignature();
  }

  protected static getCalendarHashChain(signature: KsiSignature): CalendarHashChain {
    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
    if (!calendarHashChain) {
      throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
    }

    return calendarHashChain;
  }

  protected static getCalendarHashChainDeprecatedAlgorithmLink(
    calendarHashChain: CalendarHashChain
  ): ImprintTag | null {
    if (!calendarHashChain) {
      throw new KsiVerificationError('Invalid calendar hash chain.');
    }

    for (const link of calendarHashChain.getChainLinks()) {
      if (link.id !== LinkDirection.Left) {
        continue;
      }

      if (link.getValue().hashAlgorithm.isDeprecated(calendarHashChain.getPublicationTime().valueOf())) {
        return link;
      }
    }

    return null;
  }
}
