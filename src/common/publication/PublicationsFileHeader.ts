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
import { PUBLICATIONS_FILE_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';

/**
 * Publications file header TLV object.
 */
export class PublicationsFileHeader extends CompositeTag {
  private version: IntegerTag;
  private creationTime: IntegerTag;
  private repositoryUri: StringTag | null = null;

  /**
   * Publications file header TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();
    Object.freeze(this);
  }

  /**
   * Get publications file version.
   * @returns File version.
   */
  public getVersion(): BigInteger {
    return this.version.getValue();
  }

  /**
   * Get publications file creation time.
   * @returns Unix time.
   */
  public getCreationTime(): BigInteger {
    return this.creationTime.getValue();
  }

  /**
   * Get publications file repository URI.
   * @returns Repository URI.
   */
  public getRepositoryUri(): string | null {
    return this.repositoryUri === null ? null : this.repositoryUri.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType:
        return (this.version = new IntegerTag(tlvTag));
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType:
        return (this.creationTime = new IntegerTag(tlvTag));
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType:
        return (this.repositoryUri = new StringTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType) !== 1) {
      throw new TlvError('Exactly one version must exist in publications file header.');
    }

    if (this.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType) !== 1) {
      throw new TlvError('Exactly one creation time must exist in publications file header.');
    }

    if (this.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType) > 1) {
      throw new TlvError('Only one repository URI is allowed in publications file header.');
    }
  }
}
