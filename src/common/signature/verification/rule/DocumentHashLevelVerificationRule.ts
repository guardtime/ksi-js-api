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

import { ResultCode as VerificationResultCode } from '@guardtime/common';
import bigInteger from 'big-integer';
import { KsiSignature } from '../../KsiSignature.js';
import { VerificationContext } from '../VerificationContext.js';
import { VerificationError } from '../VerificationError.js';
import { VerificationResult } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

/**
 * This rule verifies that given document hash level is not greater than the first link level
 * correction of the first aggregation hash chain. In case RFC3161 signature, the given document hash level must be 0.
 * If the level is equal to or less than expected, {@see VerificationResultCode.OK} is returned.
 */
export class DocumentHashLevelVerificationRule extends VerificationRule {
  public constructor() {
    super('DocumentHashLevelVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const levelCorrection: bigInteger.BigInteger =
      signature.getRfc3161Record() !== null
        ? bigInteger(0)
        : signature.getAggregationHashChains()[0].getChainLinks()[0].getLevelCorrection();

    return context.getDocumentHashLevel() > levelCorrection
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_03())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
