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
import { ImprintTag } from '../../../parser/ImprintTag';
import { PublicationData } from '../../../publication/PublicationData';
import { PublicationRecord } from '../../../publication/PublicationRecord';
import { PublicationsFile } from '../../../publication/PublicationsFile';
import { CalendarHashChain } from '../../CalendarHashChain';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Verifies that extender response calendar hash chain right link hash algorithms are not deprecated.
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
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const deprecatedLink: ImprintTag | null = VerificationRule.getCalendarHashChainDeprecatedAlgorithmLink(
      extendedCalendarHashChain
    );
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
