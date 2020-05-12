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

import CMSVerification from '@guardtime/common/lib/crypto/CMSVerification';
import { compareUint8Arrays } from '@guardtime/common/lib/utils/Array';
import { RawTag } from '../parser/RawTag';
import { PublicationsFile } from './PublicationsFile';
import { PublicationsFileError } from './PublicationsFileError';
import { PUBLICATIONS_FILE_SIGNATURE_CONSTANTS } from '../Constants';

/**
 * Publications file factory for publications file creation from byte array.
 */
export class PublicationsFileFactory {
  private readonly trustedCertificates: string;
  private readonly signatueSubjectToVerify: string;

  /**
   * Publications file factory constructor.
   * @param trustedCertificates Trusted certificates, defaults to {@see PUBLICATIONS_FILE_SIGNATURE_CONSTANTS#TrustedCertificates}.
   * @param signatureSubjectToVerify Subject string to verify, defaults to {@see PUBLICATIONS_FILE_SIGNATURE_CONSTANTS#GuardtimeSignatureSubjectEmail}.
   */
  public constructor(
    trustedCertificates: string = PUBLICATIONS_FILE_SIGNATURE_CONSTANTS.TrustedCertificates,
    signatureSubjectToVerify: string = PUBLICATIONS_FILE_SIGNATURE_CONSTANTS.GuardtimeSignatureSubjectEmail
  ) {
    this.trustedCertificates = trustedCertificates;
    this.signatueSubjectToVerify = signatureSubjectToVerify;
  }

  /**
   * Create publications file from bytes.
   * @param publicationFileBytes Publications file bytes.
   * @returns Publications File.
   */
  public create(publicationFileBytes: Uint8Array): PublicationsFile {
    const beginningMagicBytes: Uint8Array = PublicationsFile.FileBeginningMagicBytes;
    if (!compareUint8Arrays(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)) {
      throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
    }

    const pubFile = new PublicationsFile(
      RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length))
    );

    const verified = CMSVerification.verifyFromBytes(
      pubFile.getSignatureValue(),
      pubFile.getSignedBytes(),
      [this.trustedCertificates],
      this.signatueSubjectToVerify
    );

    if (!verified) {
      throw new PublicationsFileError('The signature on the publications file is not valid. ');
    }

    return pubFile;
  }
}
