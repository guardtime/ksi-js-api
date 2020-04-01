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

import { AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';

/**
 * Aggregator configuration response payload.
 */
export class AggregatorConfigResponsePayload extends PduPayload {
  private aggregationPeriod: IntegerTag;
  private aggregationAlgorithm: IntegerTag;
  private maxLevel: IntegerTag;
  private maxRequests: IntegerTag;
  private parentUriList: StringTag[] = [];

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxLevelTagType:
        return (this.maxLevel = new IntegerTag(tlvTag));
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationAlgorithmTagType:
        return (this.aggregationAlgorithm = new IntegerTag(tlvTag));
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationPeriodTagType:
        return (this.aggregationPeriod = new IntegerTag(tlvTag));
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
        return (this.maxRequests = new IntegerTag(tlvTag));
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
        const uriTag: StringTag = new StringTag(tlvTag);
        this.parentUriList.push(uriTag);

        return uriTag;
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  // noinspection JSMethodCanBeStatic
  protected validate(): void {
    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxLevelTagType) > 1) {
      throw new TlvError('Only one max level tag is allowed in aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationAlgorithmTagType) > 1) {
      throw new TlvError('Only one aggregation algorithm tag is allowed in aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationPeriodTagType) > 1) {
      throw new TlvError('Only one aggregation period tag is allowed in aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType) > 1) {
      throw new TlvError('Only one max requests tag is allowed in aggregator config response payload.');
    }
  }
}
