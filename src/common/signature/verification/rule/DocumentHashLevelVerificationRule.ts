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
import bigInteger from 'big-integer';
import { KsiSignature } from '../../KsiSignature';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * This rule verifies that given document hash level is not greater than the first link level
 * correction of the first aggregation hash chain. In case RFC3161 signature the given document hash level must be 0.
 * If the level is equal to or less than expected then VerificationResultCode.Ok is returned.
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
        : signature
            .getAggregationHashChains()[0]
            .getChainLinks()[0]
            .getLevelCorrection();

    return context.getDocumentHashLevel() > levelCorrection
      ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.GEN_03())
      : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
  }
}
