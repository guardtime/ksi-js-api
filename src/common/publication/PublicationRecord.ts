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

import { DataHash } from '@guardtime/common';
import bigInteger from 'big-integer';
import { PUBLICATION_DATA_CONSTANTS, PUBLICATION_RECORD_CONSTANTS } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { StringTag } from '../parser/StringTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';
import { PublicationData } from './PublicationData.js';

/**
 * Publication record TLV object.
 */
export class PublicationRecord extends CompositeTag {
  private publicationData: PublicationData;
  private publicationReferences: StringTag[] = [];
  private repositoryUri: StringTag[] = [];

  /**
   * Publication record TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * @see PublicationData#getPublicationHash()
   */
  public getPublicationHash(): DataHash {
    return this.publicationData.getPublicationHash();
  }

  /**
   * @see PublicationData#getPublicationTime()
   */
  public getPublicationTime(): bigInteger.BigInteger {
    return this.publicationData.getPublicationTime();
  }

  /**
   * Get publication data.
   * @returns Publication data.
   */
  public getPublicationData(): PublicationData {
    return this.publicationData;
  }

  /**
   * Get publication references.
   * @returns Publication references.
   */
  public getPublicationReferences(): string[] {
    return this.publicationReferences.map((reference: StringTag) => {
      return reference.getValue();
    });
  }

  /**
   * Get publication repositories.
   * @returns Publication repositories.
   */
  public getPublicationRepositories(): string[] {
    return this.repositoryUri.map((repository: StringTag) => {
      return repository.getValue();
    });
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
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
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one published data must exist in publication record.');
    }
  }
}
