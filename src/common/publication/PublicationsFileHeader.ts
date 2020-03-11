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
import { PUBLICATIONS_FILE_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag, ICount } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';

/**
 * Publications File Header TLV Object
 */
export class PublicationsFileHeader extends CompositeTag {
  private version: IntegerTag;
  private creationTime: IntegerTag;
  private repositoryUri: StringTag | null = null;

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validateValue(this.validate.bind(this));
    Object.freeze(this);
  }

  public getVersion(): BigInteger {
    return this.version.getValue();
  }

  public getCreationTime(): BigInteger {
    return this.creationTime.getValue();
  }

  public getRepositoryUri(): string | null {
    return this.repositoryUri === null ? null : this.repositoryUri.getValue();
  }

  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType:
        return (this.version = new IntegerTag(tlvTag));
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType:
        return (this.creationTime = new IntegerTag(tlvTag));
      case PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType:
        return (this.repositoryUri = new StringTag(tlvTag));
      default:
        return CompositeTag.parseTlvTag(tlvTag);
    }
  }

  // noinspection JSMethodCanBeStatic
  private validate(tagCount: ICount): void {
    if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType) !== 1) {
      throw new TlvError('Exactly one version must exist in publications file header.');
    }

    if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType) !== 1) {
      throw new TlvError('Exactly one creation time must exist in publications file header.');
    }

    if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType) > 1) {
      throw new TlvError('Only one repository uri is allowed in publications file header.');
    }
  }
}
