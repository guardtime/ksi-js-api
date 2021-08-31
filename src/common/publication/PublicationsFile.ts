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

import { BigInteger } from 'big-integer';
import { Array } from '@guardtime/common';
import {
  CERTIFICATE_RECORD_CONSTANTS,
  PUBLICATIONS_FILE_CONSTANTS,
  PUBLICATIONS_FILE_HEADER_CONSTANTS,
} from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { RawTag } from '../parser/RawTag.js';
import { TlvOutputStream } from '../parser/TlvOutputStream.js';
import { TlvTag } from '../parser/TlvTag.js';
import { CertificateRecord } from './CertificateRecord.js';
import { PublicationRecord } from './PublicationRecord.js';
import { PublicationsFileError } from './PublicationsFileError.js';
import { PublicationsFileHeader } from './PublicationsFileHeader.js';

/**
 * Publications file TLV object.
 */
export class PublicationsFile extends CompositeTag {
  /**
   * Get publication file beginning magic bytes.
   * @returns Magic bytes.
   */
  public static get FileBeginningMagicBytes(): Uint8Array {
    return new Uint8Array([0x4b, 0x53, 0x49, 0x50, 0x55, 0x42, 0x4c, 0x46]);
  }

  private readonly certificateRecordList: CertificateRecord[] = [];
  private cmsSignature: RawTag;
  private readonly publicationRecordList: PublicationRecord[] = [];
  private publicationsFileHeader: PublicationsFileHeader;
  private headerIndex = 0;
  private lastCertificateRecordIndex: number | null = null;
  private firstPublicationRecordIndex: number | null = null;
  private cmsSignatureIndex = 0;

  /**
   * Publications file TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Find certificate by its ID.
   * @param certificateId Certificate ID as bytes.
   * @returns Certificate record or null if none found.
   */
  public findCertificateById(certificateId: Uint8Array): CertificateRecord | null {
    for (const certificateRecord of this.certificateRecordList) {
      if (Array.compareUint8Arrays(certificateId, certificateRecord.getCertificateId())) {
        return certificateRecord;
      }
    }

    return null;
  }

  /**
   * Get latest publication record.
   * @returns Latest publication record or null if none found.
   */
  public getLatestPublication(): PublicationRecord | null {
    let latestPublicationRecord: PublicationRecord | null = null;
    for (const publicationRecord of this.publicationRecordList) {
      if (latestPublicationRecord === null) {
        latestPublicationRecord = publicationRecord;
        continue;
      }

      if (publicationRecord.getPublicationTime().compareTo(latestPublicationRecord.getPublicationTime()) > 0) {
        latestPublicationRecord = publicationRecord;
      }
    }

    return latestPublicationRecord;
  }

  /**
   * Get nearest publication record to given unix time.
   * @param unixTime Unix time in seconds.
   * @returns Nearest publication record or null if none found.
   */
  public getNearestPublicationRecord(unixTime: BigInteger): PublicationRecord | null {
    let nearestPublicationRecord: PublicationRecord | null = null;
    for (const publicationRecord of this.publicationRecordList) {
      const publicationTime: BigInteger = publicationRecord.getPublicationTime();
      if (publicationTime.compareTo(unixTime) < 0) {
        continue;
      }

      if (nearestPublicationRecord == null) {
        nearestPublicationRecord = publicationRecord;
        continue;
      }

      if (publicationTime.compareTo(nearestPublicationRecord.getPublicationTime()) < 0) {
        nearestPublicationRecord = publicationRecord;
      }
    }

    return nearestPublicationRecord;
  }

  /**
   * Get publications file signature bytes.
   * @returns Signature bytes.
   */
  public getSignatureValue(): Uint8Array {
    return this.cmsSignature.getValue();
  }

  /**
   * Get publications file signed bytes.
   * @returns Signed bytes.
   */
  public getSignedBytes(): Uint8Array {
    const stream: TlvOutputStream = new TlvOutputStream();
    stream.write(PublicationsFile.FileBeginningMagicBytes);
    for (const tlvTag of this.value) {
      if (tlvTag.id !== PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType) {
        stream.writeTag(tlvTag);
      }
    }

    return stream.getData();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag, position: number): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType:
        this.headerIndex = position;

        return (this.publicationsFileHeader = new PublicationsFileHeader(tlvTag));
      case CERTIFICATE_RECORD_CONSTANTS.TagType:
        this.lastCertificateRecordIndex = position;
        const certificateRecord: CertificateRecord = new CertificateRecord(tlvTag);
        this.certificateRecordList.push(certificateRecord);

        return certificateRecord;
      case PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType:
        if (this.firstPublicationRecordIndex === null) {
          this.firstPublicationRecordIndex = position;
        }

        const publicationRecord: PublicationRecord = new PublicationRecord(tlvTag);
        this.publicationRecordList.push(publicationRecord);

        return publicationRecord;
      case PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType:
        this.cmsSignatureIndex = position;

        return (this.cmsSignature = new RawTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType) !== 1) {
      throw new PublicationsFileError('Exactly one publications file header must exist in publications file.');
    }

    if (this.getCount(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType) !== 1) {
      throw new PublicationsFileError('Exactly one signature must exist in publications file.');
    }

    if (this.headerIndex !== 0) {
      throw new PublicationsFileError('Publications file header should be the first element in publications file.');
    }

    if (
      this.firstPublicationRecordIndex !== null &&
      this.lastCertificateRecordIndex !== null &&
      this.firstPublicationRecordIndex <= this.lastCertificateRecordIndex
    ) {
      throw new PublicationsFileError('Certificate records should be before publication records.');
    }

    if (this.cmsSignatureIndex !== this.value.length - 1) {
      throw new PublicationsFileError('Cms signature should be last element in publications file.');
    }
  }
}
