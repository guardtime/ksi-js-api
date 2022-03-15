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

import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result.js';
import { ImprintTag } from '../../../parser/ImprintTag.js';
import { PublicationData } from '../../../publication/PublicationData.js';
import { PublicationRecord } from '../../../publication/PublicationRecord.js';
import { PublicationsFile } from '../../../publication/PublicationsFile.js';
import { CalendarHashChain } from '../../CalendarHashChain.js';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * Verifies that Extender response calendar hash chain right link hash algorithms are not deprecated.
 */
export class ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule extends VerificationRule {
  public constructor() {
    super('ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const userPublication: PublicationData | null = context.getUserPublication();

    let publicationData: PublicationData;
    if (userPublication !== null) {
      publicationData = userPublication;
    } else {
      const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
      if (publicationsFile === null) {
        return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
      }

      const publicationRecord: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(
        signature.getAggregationTime()
      );

      if (publicationRecord === null) {
        return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
      }

      publicationData = publicationRecord.getPublicationData();
    }

    let extendedCalendarHashChain: CalendarHashChain | null = null;
    try {
      extendedCalendarHashChain = await context.getExtendedCalendarHashChain(publicationData.getPublicationTime());
    } catch (e) {
      console.warn(`Calendar extending failed: ${e}`);
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const deprecatedLink: ImprintTag | null =
      VerificationRule.getCalendarHashChainDeprecatedAlgorithmLink(extendedCalendarHashChain);
    if (deprecatedLink !== null) {
      console.debug(
        `Calendar hash chain contains deprecated aggregation algorithm at publication time. Algorithm: ${
          deprecatedLink.getValue().hashAlgorithm.name
        }; Publication time: ${publicationData.getPublicationTime()}.`
      );

      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
