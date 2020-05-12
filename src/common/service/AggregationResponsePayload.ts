/*
 * Copyright 2013-2019 Guardtime, Inc.
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

import {
  AGGREGATION_HASH_CHAIN_CONSTANTS,
  CALENDAR_AUTHENTICATION_RECORD_CONSTANTS,
  CALENDAR_HASH_CHAIN_CONSTANTS,
  KSI_SIGNATURE_CONSTANTS,
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
  public constructor(tlvTag: TlvTag) {
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
