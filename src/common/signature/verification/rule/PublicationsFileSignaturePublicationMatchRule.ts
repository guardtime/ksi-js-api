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
import { PublicationRecord } from '../../../publication/PublicationRecord';
import { PublicationsFile } from '../../../publication/PublicationsFile';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule checks if publications file and signature publication record match.
 */
export class PublicationsFileSignaturePublicationMatchRule extends VerificationRule {
  public constructor() {
    super('PublicationsFileSignaturePublicationMatchRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
    if (publicationsFile === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const signature: KsiSignature = context.getSignature();
    const publicationRecord: PublicationRecord | null = signature.getPublicationRecord();
    if (publicationRecord == null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const publicationRecordInPublicationFile: PublicationRecord | null = publicationsFile.getNearestPublicationRecord(
      publicationRecord.getPublicationTime()
    );

    if (
      publicationRecordInPublicationFile === null ||
      publicationRecordInPublicationFile.getPublicationTime().neq(publicationRecord.getPublicationTime())
    ) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    return !publicationRecordInPublicationFile.getPublicationHash().equals(publicationRecord.getPublicationHash())
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.PUB_05())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
