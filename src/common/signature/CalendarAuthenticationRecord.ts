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

import { PUBLICATION_DATA_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from '../publication/PublicationData';
import { SignatureData } from './SignatureData';

/**
 * Calendar Authentication Record TLV object.
 */
export class CalendarAuthenticationRecord extends CompositeTag {
  private publicationData: PublicationData;
  private signatureData: SignatureData;

  /**
   * Calendar Authentication Record TLV object constructor.
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
   * @returns Publcations data.
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
