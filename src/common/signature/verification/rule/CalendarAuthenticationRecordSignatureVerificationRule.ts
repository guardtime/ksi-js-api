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
import HexCoder from '@guardtime/common/lib/coders/HexCoder';
import X509 from '@guardtime/common/lib/crypto/X509';
import { CertificateRecord } from '../../../publication/CertificateRecord';
import { PublicationsFile } from '../../../publication/PublicationsFile';
import { CalendarAuthenticationRecord } from '../../CalendarAuthenticationRecord';
import { KsiSignature } from '../../KsiSignature';
import { SignatureData } from '../../SignatureData';
import { KsiVerificationError } from '../KsiVerificationError';
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
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(new KsiVerificationError('Publications file missing from context.'))
      );
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
      return new VerificationResult(
        this.getRuleName(),
        VerificationResultCode.NA,
        VerificationError.GEN_02(
          new KsiVerificationError(
            `No certificate found in publications file with id: ${HexCoder.encode(signatureData.getCertificateId())}.`
          )
        )
      );
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
      console.debug(error);
    }

    return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.KEY_02());
  }
}
