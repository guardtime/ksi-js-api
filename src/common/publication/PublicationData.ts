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

import Base32Coder from '@guardtime/common/lib/coders/Base32Coder';
import UnsignedLongCoder from '@guardtime/common/lib/coders/UnsignedLongCoder';
import CRC32 from '@guardtime/common/lib/crc/CRC32';
import DataHash from '@guardtime/common/lib/hash/DataHash';
import { compareUint8Arrays } from '@guardtime/common/lib/utils/Array';
import { BigInteger } from 'big-integer';
import { PUBLICATION_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';

/**
 * Publication Data TLV object.
 */
export class PublicationData extends CompositeTag {
  private publicationTime: IntegerTag;
  private publicationHash: ImprintTag;

  /**
   * Publication data TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();
    Object.freeze(this);
  }

  /**
   * Create publication data TLV object from publication time and hash.
   * @param publicationTime Publication time in seconds.
   * @param publicationHash Publication hash.
   * @returns
   */
  public static CREATE(publicationTime: BigInteger, publicationHash: DataHash): PublicationData {
    return new PublicationData(
      CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
        IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, publicationTime),
        ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false, publicationHash),
      ])
    );
  }

  /**
   * Create publication data TLV object from publication string.
   * @param publicationString Publication string.
   * @returns
   */
  public static CREATE_FROM_PUBLICATION_STRING(publicationString: string): PublicationData {
    const bytesWithCrc32: Uint8Array = Base32Coder.decode(publicationString);

    // Length needs to be at least 13 bytes (8 bytes for time plus non-empty hash imprint plus 4 bytes for crc32)
    if (bytesWithCrc32.length < 13) {
      throw new TlvError('Publication string base 32 decode failed.');
    }

    const calculatedCrc32: Uint8Array = UnsignedLongCoder.encode(CRC32.create(bytesWithCrc32.slice(0, -4)));
    const messageCrc32: Uint8Array = bytesWithCrc32.slice(-4);

    if (!compareUint8Arrays(calculatedCrc32, messageCrc32)) {
      throw new TlvError(
        `Publication string CRC 32 check failed. Calculated: ${JSON.stringify(
          calculatedCrc32
        )}; From Message: ${JSON.stringify(messageCrc32)}`
      );
    }

    return PublicationData.CREATE(
      UnsignedLongCoder.decode(bytesWithCrc32, 0, 8),
      new DataHash(bytesWithCrc32.slice(8, -4))
    );
  }

  /**
   * Get publication hash.
   * @returns Publication hash.
   */
  public getPublicationHash(): DataHash {
    return this.publicationHash.getValue();
  }

  /**
   * Get publication time.
   * @returns Publication time in seconds.
   */
  public getPublicationTime(): BigInteger {
    return this.publicationTime.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType:
        return (this.publicationTime = new IntegerTag(tlvTag));
      case PUBLICATION_DATA_CONSTANTS.PublicationHashTagType:
        return (this.publicationHash = new ImprintTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType) !== 1) {
      throw new TlvError('Exactly one publication time must exist in published data.');
    }

    if (this.getCount(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType) !== 1) {
      throw new TlvError('Exactly one published hash must exist in published data.');
    }
  }
}
