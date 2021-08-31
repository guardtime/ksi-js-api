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

import {
  AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS,
  AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS,
  AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS,
  ERROR_PAYLOAD_CONSTANTS,
} from '../Constants.js';
import { TlvTag } from '../parser/TlvTag.js';
import { AggregationErrorPayload } from './AggregationErrorPayload.js';
import { AggregationResponsePayload } from './AggregationResponsePayload.js';
import { AggregatorConfigResponsePayload } from './AggregatorConfigResponsePayload.js';
import { Pdu } from './Pdu.js';
import { PduPayload } from './PduPayload.js';

/**
 * Aggregation response PDU TLV object.
 */
export class AggregationResponsePdu extends Pdu {
  private aggregatorConfigResponse: AggregatorConfigResponsePayload | null = null;

  /**
   * Aggregation response PDU TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get all aggregation response payloads.
   * @returns Aggregation response payloads.
   */
  public getAggregationResponsePayloads(): PduPayload[] {
    return this.payloads.filter((payload) => payload.id === AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS.TagType);
  }

  /**
   * Get Aggregator config response payload.
   * @returns Aggregator config response, if missing then null.
   */
  public getAggregatorConfigResponsePayload(): AggregatorConfigResponsePayload | null {
    return this.aggregatorConfigResponse;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS.TagType:
        const aggregationResponsePayload: AggregationResponsePayload = new AggregationResponsePayload(tlvTag);
        this.payloads.push(aggregationResponsePayload);

        return aggregationResponsePayload;
      case ERROR_PAYLOAD_CONSTANTS.TagType:
        return (this.errorPayload = new AggregationErrorPayload(tlvTag));
      case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
        const configResponsePayload = new AggregatorConfigResponsePayload(tlvTag);
        this.payloads.push(configResponsePayload);
        if (!this.aggregatorConfigResponse) {
          this.aggregatorConfigResponse = configResponsePayload;
        }

        return configResponsePayload;
      // not implemented yet, so just return the tag
      case AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS.TagType:
        return tlvTag;
      default:
        return super.parseChild(tlvTag);
    }
  }
}
