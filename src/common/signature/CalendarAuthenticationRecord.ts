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

import { PUBLICATION_DATA_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from '../publication/PublicationData';
import { SignatureData } from './SignatureData';

/**
 * Calendar authentication record TLV object.
 */
export class CalendarAuthenticationRecord extends CompositeTag {
  private publicationData: PublicationData;
  private signatureData: SignatureData;

  /**
   * Calendar authentication record TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get publications data.
   * @returns Publications data.
   */
  public getPublicationData(): PublicationData {
    return this.publicationData;
  }

  /**
   * Get signature data.
   * @returns Signature data.
   */
  public getSignatureData(): SignatureData {
    return this.signatureData;
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
      case SIGNATURE_DATA_CONSTANTS.TagType:
        return (this.signatureData = new SignatureData(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one published data must exist in calendar authentication record.');
    }

    if (this.getCount(SIGNATURE_DATA_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one signature data must exist in calendar authentication record.');
    }
  }
}
