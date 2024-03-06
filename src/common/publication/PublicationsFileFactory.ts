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

import * as ArrayUtils from '@guardtime/common/lib/utils/Array.js';
import { SignedDataVerifier } from '@guardtime/common/lib/crypto/pkcs7/SignedDataVerifier.js';
import { ResultCode } from '@guardtime/common/lib/verification/Result.js';
import { SpkiFactory } from '@guardtime/common/lib/crypto/pkcs7/SpkiFactory.js';
import { Pkcs7Envelope } from '@guardtime/common/lib/crypto/pkcs7/Pkcs7Envelope.js';
import { RawTag } from '../parser/RawTag.js';
import { PublicationsFile } from './PublicationsFile.js';
import { PublicationsFileError } from './PublicationsFileError.js';
import { PUBLICATIONS_FILE_SIGNATURE_CONSTANTS } from '../Constants.js';
import { Pkcs7ContentType, Pkcs7EnvelopeVerifier } from '@guardtime/common/lib/crypto/pkcs7/Pkcs7EnvelopeVerifier.js';

/**
 * Publications file factory for publications file creation from byte array.
 */
export class PublicationsFileFactory {
  private readonly trustedCertificate: Uint8Array;
  private readonly signatueSubjectToVerify: string;
  private readonly spkiFactory: SpkiFactory;

  /**
   * Publications file factory constructor.
   * @param spkiFactory Public key factory to create key from SPKI
   * @param trustedCertificate Trusted certificates, defaults to {@see PUBLICATIONS_FILE_SIGNATURE_CONSTANTS#TrustedCertificates}.
   * @param signatureSubjectToVerify Subject string to verify, defaults to {@see PUBLICATIONS_FILE_SIGNATURE_CONSTANTS#GuardtimeSignatureSubjectEmail}.
   */
  public constructor(
    spkiFactory: SpkiFactory,
    trustedCertificate: Uint8Array = PUBLICATIONS_FILE_SIGNATURE_CONSTANTS.TrustedCertificate,
    signatureSubjectToVerify: string = PUBLICATIONS_FILE_SIGNATURE_CONSTANTS.GuardtimeSignatureSubjectEmail,
  ) {
    this.spkiFactory = spkiFactory;
    this.trustedCertificate = trustedCertificate;
    this.signatueSubjectToVerify = signatureSubjectToVerify;
  }

  /**
   * Create publications file from bytes.
   * @param publicationFileBytes Publications file bytes.
   * @returns Publications file.
   */
  public async create(publicationFileBytes: Uint8Array): Promise<PublicationsFile> {
    const beginningMagicBytes: Uint8Array = PublicationsFile.FileBeginningMagicBytes;
    if (
      !ArrayUtils.compareUint8Arrays(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)
    ) {
      throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
    }

    const pubFile = new PublicationsFile(
      RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)),
    );

    const signedData = Pkcs7Envelope.createFromBytes(pubFile.getSignatureValue());

    const verifier = new Pkcs7EnvelopeVerifier();
    verifier.registerVerifier(
      Pkcs7ContentType.SIGNED_DATA,
      new SignedDataVerifier(this.spkiFactory, this.trustedCertificate, this.signatueSubjectToVerify),
    );

    const result = await verifier.verify(signedData, pubFile.getSignedBytes());

    if (result.getResultCode() !== ResultCode.OK) {
      throw new PublicationsFileError('The signature on the publications file is not valid.');
    }

    return pubFile;
  }
}
