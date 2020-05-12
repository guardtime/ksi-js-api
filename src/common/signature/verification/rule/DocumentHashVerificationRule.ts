/*
 * Copyright 2013-2020 Guardtime, Inc.
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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule verifies document hash. If RFC3161 record is present then document hash must equal to RFC3161 record input hash.
 * Otherwise document hash is compared to aggregation hash chain input hash.
 * If document hash is not provided then VerificationResultCode.Ok is returned.
 */
export class DocumentHashVerificationRule extends VerificationRule {
  public constructor() {
    super('DocumentHashVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const documentHash: DataHash | null = context.getDocumentHash();

    if (documentHash === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const inputHash: DataHash = signature.getInputHash();
    if (!documentHash.equals(inputHash)) {
      console.debug(`Invalid document hash. Expected ${documentHash}, found ${inputHash}.`);

      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_01());
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
