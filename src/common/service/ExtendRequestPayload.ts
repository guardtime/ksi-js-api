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
import { EXTEND_REQUEST_PAYLOAD_CONSTANTS, PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';

/**
 * Extend request payload TLV object.
 */
export class ExtendRequestPayload extends PduPayload {
  private requestId: IntegerTag;
  private aggregationTime: IntegerTag;
  private publicationTime: IntegerTag;

  /**
   * Extend request payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Create extend request payload TLV object from data.
   * @param requestId Request ID.
   * @param aggregationTime Aggregation time.
   * @param publicationTime Publication time, by default null.
   * @returns {ExtendRequestPayload} Extend request payload.
   */
  public static CREATE(
    requestId: BigInteger,
    aggregationTime: BigInteger,
    publicationTime: BigInteger | null = null
  ): ExtendRequestPayload {
    const childTlv: TlvTag[] = [
      IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
      IntegerTag.CREATE(EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType, false, false, aggregationTime),
    ];

    if (publicationTime !== null) {
      childTlv.push(
        IntegerTag.CREATE(EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType, false, false, publicationTime)
      );
    }

    return new ExtendRequestPayload(
      CompositeTag.CREATE_FROM_LIST(EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv)
    );
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns {TlvTag} TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
        return (this.requestId = new IntegerTag(tlvTag));
      case EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType:
        return (this.aggregationTime = new IntegerTag(tlvTag));
      case EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType:
        return (this.publicationTime = new IntegerTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
      throw new TlvError('Exactly one request id must exist in extend request payload.');
    }

    if (this.getCount(EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType) !== 1) {
      throw new TlvError('Exactly one aggregation time must exist in extend request payload.');
    }

    if (this.getCount(EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType) > 1) {
      throw new TlvError('Only one publication time is allowed in extend request payload.');
    }
  }
}
