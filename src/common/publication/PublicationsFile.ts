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

import { BigInteger } from 'big-integer';
import {
  CERTIFICATE_RECORD_CONSTANTS,
  PUBLICATIONS_FILE_CONSTANTS,
  PUBLICATIONS_FILE_HEADER_CONSTANTS
} from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { TlvOutputStream } from '../parser/TlvOutputStream';
import { TlvTag } from '../parser/TlvTag';
import { compareTypedArray } from '../util/Array';
import { CertificateRecord } from './CertificateRecord';
import { PublicationRecord } from './PublicationRecord';
import { PublicationsFileError } from './PublicationsFileError';
import { PublicationsFileHeader } from './PublicationsFileHeader';

/**
 * Publications File TLV object
 */
export class PublicationsFile extends CompositeTag {
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

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  public findCertificateById(certificateId: Uint8Array): CertificateRecord | null {
    for (const certificateRecord of this.certificateRecordList) {
      if (compareTypedArray(certificateId, certificateRecord.getCertificateId())) {
        return certificateRecord;
      }
    }

    return null;
  }

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

  public getSignatureValue(): Uint8Array {
    return this.cmsSignature.getValue();
  }

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
