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

import Base32Coder from '@guardtime/gt-js-common/lib/coders/Base32Coder';
import UnsignedLongCoder from '@guardtime/gt-js-common/lib/coders/UnsignedLongCoder';
import CRC32 from '@guardtime/gt-js-common/lib/crc/CRC32';
import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger, { BigInteger } from 'big-integer';
import { PUBLICATION_DATA_CONSTANTS } from '../Constants';
import { CompositeTag, ICount } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { compareTypedArray } from '../util/Array';

/**
 * Publication Data TLV object
 */
export class PublicationData extends CompositeTag {
  private publicationTime: IntegerTag;
  private publicationHash: ImprintTag;

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validateValue(this.validate.bind(this));
    Object.freeze(this);
  }

  public static CREATE(publicationTime: BigInteger, publicationHash: DataHash): PublicationData {
    return new PublicationData(
      CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
        IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, publicationTime),
        ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false, publicationHash)
      ])
    );
  }

  public static CREATE_FROM_PUBLICATION_STRING(publicationString: string): PublicationData {
    const bytesWithCrc32: Uint8Array = Base32Coder.decode(publicationString);

    // Length needs to be at least 13 bytes (8 bytes for time plus non-empty hash imprint plus 4 bytes for crc32)
    if (bytesWithCrc32.length < 13) {
      throw new TlvError('Publication string base 32 decode failed.');
    }

    const calculatedCrc32: Uint8Array = UnsignedLongCoder.encode(CRC32.create(bytesWithCrc32.slice(0, -4)));
    const messageCrc32: Uint8Array = bytesWithCrc32.slice(-4);

    if (!compareTypedArray(calculatedCrc32, messageCrc32)) {
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

  public getPublicationHash(): DataHash {
    return this.publicationHash.getValue();
  }

  public getPublicationTime(): bigInteger.BigInteger {
    return this.publicationTime.getValue();
  }

  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType:
        return (this.publicationTime = new IntegerTag(tlvTag));
      case PUBLICATION_DATA_CONSTANTS.PublicationHashTagType:
        return (this.publicationHash = new ImprintTag(tlvTag));
      default:
        return CompositeTag.parseTlvTag(tlvTag);
    }
  }

  // noinspection JSMethodCanBeStatic
  private validate(tagCount: ICount): void {
    if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType) !== 1) {
      throw new TlvError('Exactly one publication time must exist in publication data.');
    }

    if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType) !== 1) {
      throw new TlvError('Exactly one publication hash must exist in publication data.');
    }
  }
}
