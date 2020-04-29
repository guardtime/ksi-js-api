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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import bigInteger, { BigInteger } from 'big-integer';
import { AGGREGATION_REQUEST_PAYLOAD_CONSTANTS, PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';

/**
 * Aggregation request payload TLV object.
 */
export class AggregationRequestPayload extends CompositeTag {
  private requestId: IntegerTag;
  private requestHash: ImprintTag;
  private requestLevel: IntegerTag;

  /**
   * Aggregation request payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Create aggregation request payload TLV object from data.
   * @param requestId Request ID.
   * @param hash Request hash.
   * @param level Request level, default value 0.
   * @returns Aggregation request payload.
   */
  public static CREATE(
    requestId: BigInteger,
    hash: DataHash,
    level: BigInteger = bigInteger(0)
  ): AggregationRequestPayload {
    const childTlv: TlvTag[] = [
      IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
      ImprintTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType, false, false, hash)
    ];

    if (level.neq(0)) {
      childTlv.push(IntegerTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType, false, false, level));
    }

    return new AggregationRequestPayload(
      CompositeTag.CREATE_FROM_LIST(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv)
    );
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
        return (this.requestId = new IntegerTag(tlvTag));
      case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType:
        return (this.requestHash = new ImprintTag(tlvTag));
      case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType:
        return (this.requestLevel = new IntegerTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
      throw new TlvError('Exactly one request id must exist in aggregation request payload.');
    }

    if (this.getCount(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType) !== 1) {
      throw new TlvError('Exactly one request hash must exist in aggregation request payload.');
    }

    if (this.getCount(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType) > 1) {
      throw new TlvError('Only one request level is allowed in aggregation request payload.');
    }
  }
}
