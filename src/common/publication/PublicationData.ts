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

import { Base32Coder } from '@guardtime/common/lib/coders/Base32Coder.js';
import { UnsignedLongCoder } from '@guardtime/common/lib/coders/UnsignedLongCoder.js';
import { CRC32 } from '@guardtime/common/lib/crc/CRC32.js';
import { DataHash } from '@guardtime/common/lib/hash/DataHash.js';
import * as ArrayUtils from '@guardtime/common/lib/utils/Array.js';
import { BigInteger } from 'big-integer';
import { PUBLICATION_DATA_CONSTANTS } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { ImprintTag } from '../parser/ImprintTag.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';

/**
 * Publication data TLV object.
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

    if (!ArrayUtils.compareUint8Arrays(calculatedCrc32, messageCrc32)) {
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

  public toPublicationString(): string {
    const bytes = new Uint8Array(this.getPublicationHash().hashAlgorithm.length + 13);
    const timeBytes = UnsignedLongCoder.encode(this.getPublicationTime());
    bytes.set(timeBytes, 8 - timeBytes.length);
    bytes.set(this.getPublicationHash().imprint, 8);
    const crcInputBytes = bytes.slice(0, -4);
    const crcBytes = UnsignedLongCoder.encode(CRC32.create(crcInputBytes));
    bytes.set(crcBytes, this.getPublicationHash().hashAlgorithm.length + 13 - crcBytes.length);

    return Base32Coder.encode(bytes);
  }
}
