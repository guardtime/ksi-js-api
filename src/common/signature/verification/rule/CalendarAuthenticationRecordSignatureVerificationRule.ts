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

import { ResultCode as VerificationResultCode } from '@guardtime/common/lib/verification/Result';
import X509 from '@guardtime/common/lib/crypto/X509';
import { CertificateRecord } from '../../../publication/CertificateRecord';
import { PublicationsFile } from '../../../publication/PublicationsFile';
import { CalendarAuthenticationRecord } from '../../CalendarAuthenticationRecord';
import { KsiSignature } from '../../KsiSignature';
import { SignatureData } from '../../SignatureData';
import { VerificationContext } from '../VerificationContext';
import { VerificationError } from '../VerificationError';
import { VerificationResult } from '../VerificationResult';
import { VerificationRule } from '../VerificationRule';

/**
 * Rule validates calendar authentication record signature. Signature is made from calendar authentication record
 * publication data. X.509 certificate is searched from publications file and when found, it is used to validate PKI
 * signature in calendar authentication record.
 */
export class CalendarAuthenticationRecordSignatureVerificationRule extends VerificationRule {
  public constructor() {
    super('CalendarAuthenticationRecordSignatureVerificationRule');
  }

  /**
   * Verify current rule with given context.
   * @param context Verification context.
   * @returns Verification result.
   */
  public async verify(context: VerificationContext): Promise<VerificationResult> {
    const signature: KsiSignature = context.getSignature();
    const calendarAuthenticationRecord: CalendarAuthenticationRecord | null = signature.getCalendarAuthenticationRecord();

    if (calendarAuthenticationRecord == null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }

    const publicationsFile: PublicationsFile | null = context.getPublicationsFile();
    if (publicationsFile === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    const signatureData: SignatureData = calendarAuthenticationRecord.getSignatureData();
    switch (signatureData.getSignatureType()) {
      case '1.2.840.113549.1.1.11':
        break;
      case '1.2.840.113549.1.7.2':
        throw new Error('Not implemented');
      default:
        return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02());
    }

    const certificateRecord: CertificateRecord | null = publicationsFile.findCertificateById(
      signatureData.getCertificateId()
    );

    if (certificateRecord === null) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.NA, VerificationError.GEN_02());
    }

    if (!X509.isCertificateValidDuring(certificateRecord.getX509Certificate(), signature.getAggregationTime())) {
      return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_03());
    }

    const signedBytes: Uint8Array = calendarAuthenticationRecord.getPublicationData().encode();
    try {
      if (X509.verify(certificateRecord.getX509Certificate(), signedBytes, signatureData.getSignatureValue())) {
        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
      }
    } catch (error) {
      console.debug(`Calendar authentication record signature verification failed: ${error}`);
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02());
  }
}
