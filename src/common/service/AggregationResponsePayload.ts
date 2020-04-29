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

import {
  AGGREGATION_HASH_CHAIN_CONSTANTS,
  CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
  CALENDAR_HASH_CHAIN_CONSTANTS,
  KSI_SIGNATURE_CONSTANTS
} from '../Constants';
import { TlvTag } from '../parser/TlvTag';
import { RequestResponsePayload } from './RequestResponsePayload';

/**
 * Aggregation response payload TLV object.
 */
export class AggregationResponsePayload extends RequestResponsePayload {
  /**
   * Aggregation response payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get signature TLV objects from response.
   * @returns Signature TLV objects.
   */
  public getSignatureTags(): TlvTag[] {
    const tlvList: TlvTag[] = [];
    for (const tlvTag of this.value) {
      if (tlvTag.id > 0x800 && tlvTag.id < 0x900) {
        tlvList.push(tlvTag);
      }
    }

    return tlvList;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
      case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
      case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
      case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
        return tlvTag;
      default:
        return super.parseChild(tlvTag);
    }
  }
}
