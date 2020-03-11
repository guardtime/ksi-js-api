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

import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger from 'big-integer';
import { PUBLICATION_DATA_CONSTANTS, PUBLICATION_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag, ICount } from '../parser/CompositeTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from './PublicationData';

/**
 * Publication Record TLV object
 */
export class PublicationRecord extends CompositeTag {
  private publicationData: PublicationData;
  private publicationReferences: StringTag[] = [];
  private repositoryUri: StringTag[] = [];

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validateValue(this.validate.bind(this));

    Object.freeze(this);
  }

  public getPublicationHash(): DataHash {
    return this.publicationData.getPublicationHash();
  }

  public getPublicationTime(): bigInteger.BigInteger {
    return this.publicationData.getPublicationTime();
  }

  public getPublicationData(): PublicationData {
    return this.publicationData;
  }

  public getPublicationReferences(): string[] {
    return this.publicationReferences.map((reference: StringTag) => {
      return reference.getValue();
    });
  }

  public getPublicationRepositories(): string[] {
    return this.repositoryUri.map((repository: StringTag) => {
      return repository.getValue();
    });
  }

  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PUBLICATION_DATA_CONSTANTS.TagType:
        return (this.publicationData = new PublicationData(tlvTag));
      case PUBLICATION_RECORD_CONSTANTS.PublicationReferencesTagType:
        const reference: StringTag = new StringTag(tlvTag);
        this.publicationReferences.push(reference);

        return reference;
      case PUBLICATION_RECORD_CONSTANTS.PublicationRepositoryUriTagType:
        const uri: StringTag = new StringTag(tlvTag);
        this.repositoryUri.push(uri);

        return uri;
      default:
        return CompositeTag.parseTlvTag(tlvTag);
    }
  }

  // noinspection JSMethodCanBeStatic
  private validate(tagCount: ICount): void {
    if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one publication data must exist in publication record.');
    }
  }
}
