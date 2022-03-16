/*
 * Copyright 2013-2022 Guardtime, Inc.
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

import { Rule } from '@guardtime/common/lib/verification/Rule.js';
import { LinkDirection } from '../../Constants.js';
import { ImprintTag } from '../../parser/ImprintTag.js';
import { CalendarHashChain } from '../CalendarHashChain.js';
import { KsiSignature } from '../KsiSignature.js';
import { KsiVerificationError } from './KsiVerificationError.js';
import { VerificationContext } from './VerificationContext.js';
import { VerificationError } from './VerificationError.js';

/**
 * Verification rule for KSI signature.
 */
export abstract class VerificationRule extends Rule<VerificationContext, VerificationError> {
  /**
   * Get KSI signature from context, throw error if KSI signature is missing.
   * @param context Verification context.
   * @returns KSI signature.
   */
  protected static getSignature(context: VerificationContext): KsiSignature {
    if (!context.getSignature()) {
      throw new KsiVerificationError('Invalid KSI signature in context: null.');
    }

    return context.getSignature();
  }

  /**
   * Get calendar hash chain from signature, throw error if calendar hash chain is missing.
   * @param signature KSI signature.
   * @returns Calendar hash chain.
   */
  protected static getCalendarHashChain(signature: KsiSignature): CalendarHashChain {
    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();
    if (!calendarHashChain) {
      throw new KsiVerificationError('Calendar hash chain is missing from KSI signature.');
    }

    return calendarHashChain;
  }

  /**
   * Get calendar hash chain deprecated algorithm link.
   * @param calendarHashChain Calendar hash chain.
   * @returns Deprecated algorithm imprint TLV object.
   */
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
