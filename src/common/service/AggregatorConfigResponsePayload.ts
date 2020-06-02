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
import { AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';

/**
 * Aggregator configuration response payload TLV object.
 */
export class AggregatorConfigResponsePayload extends PduPayload {
  private aggregationPeriod: IntegerTag | null = null;
  private aggregationAlgorithm: IntegerTag | null = null;
  private maxLevel: IntegerTag | null = null;
  private maxRequests: IntegerTag | null = null;
  private parentUriList: StringTag[] = [];

  /**
   * Aggregator configuration response payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get aggregation period.
   * @returns Aggregation period, null if value is not set.
   */
  public getAggregationPeriod(): BigInteger | null {
    return this.aggregationPeriod === null ? null : this.aggregationPeriod.getValue();
  }

  /**
   * Get aggregation algorithm.
   * @returns Aggregation algorithm, null if value is not set.
   */
  public getAggregationAlgorithm(): BigInteger | null {
    return this.aggregationAlgorithm === null ? null : this.aggregationAlgorithm.getValue();
  }

  /**
   * Get max level.
   * @returns Max level, null if value is not set.
   */
  public getMaxLevel(): BigInteger | null {
    return this.maxLevel === null ? null : this.maxLevel.getValue();
  }

  /**
   * Get max amount of requests.
   * @returns Amount of requests.
   */
  public getMaxRequests(): BigInteger | null {
    return this.maxRequests === null ? null : this.maxRequests.getValue();
  }

  /**
   * Get parent URI list.
   * @returns Parent URI list.
   */
  public getParentUriList(): string[] {
    return this.parentUriList.map((parentUri: StringTag) => {
      return parentUri.getValue();
    });
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
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

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxLevelTagType) > 1) {
      throw new TlvError('Only one max level tag is allowed in Aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationAlgorithmTagType) > 1) {
      throw new TlvError('Only one aggregation algorithm tag is allowed in Aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationPeriodTagType) > 1) {
      throw new TlvError('Only one aggregation period tag is allowed in Aggregator config response payload.');
    }

    if (this.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType) > 1) {
      throw new TlvError('Only one max requests tag is allowed in Aggregator config response payload.');
    }
  }
}
