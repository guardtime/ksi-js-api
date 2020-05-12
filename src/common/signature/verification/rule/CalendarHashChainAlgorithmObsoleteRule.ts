/*
 * Copyright 2013-2019 Guardtime, Inc.
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
import { LinkDirection } from '../../../Constants';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Verifies that calendar hash chain right link hash algorithms were not obsolete at the publication time.
 * If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainAlgorithmObsoleteRule extends VerificationRule {
  public constructor() {
    super('CalendarHashChainAlgorithmObsoleteRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

    if (calendarHashChain === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    for (const link of calendarHashChain.getChainLinks()) {
      if (link.id !== LinkDirection.Left) {
        continue;
      }

      if (link.getValue().hashAlgorithm.isObsolete(calendarHashChain.getPublicationTime().valueOf())) {
        console.debug(
          `Calendar hash chain contains obsolete aggregation algorithm at publication time. Algorithm: ${
            link.getValue().hashAlgorithm.name
          }; Publication time: ${calendarHashChain.getPublicationTime()}.`
        );

        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_16());
      }
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
