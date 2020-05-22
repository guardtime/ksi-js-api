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

import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import {
  AGGREGATION_REQUEST_PAYLOAD_CONSTANTS,
  AGGREGATION_REQUEST_PDU_CONSTANTS,
  AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS,
} from '../Constants';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { AggregationRequestPayload } from './AggregationRequestPayload';
import { AggregatorConfigRequestPayload } from './AggregatorConfigRequestPayload';
import { Pdu } from './Pdu';
import { PduHeader } from './PduHeader';

/**
 * Aggregation request PDU TLV object.
 */
export class AggregationRequestPdu extends Pdu {
  private aggregatorConfigRequest: AggregatorConfigRequestPayload;

  /**
   * Aggregation request PDU TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Create aggregation request PDU TLV object from aggregation request payload.
   * @param header PDU header.
   * @param payload Aggregation request payload.
   * @param algorithm HMAC algorithm.
   * @param key HMAC key.
   * @returns Aggregation request PDU promise.
   */
  public static async CREATE(
    header: PduHeader,
    payload: AggregationRequestPayload,
    algorithm: HashAlgorithm,
    key: Uint8Array
  ): Promise<AggregationRequestPdu> {
    return new AggregationRequestPdu(
      await Pdu.CREATE_PDU(AGGREGATION_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key)
    );
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType:
        const aggregationRequestPayload: AggregationRequestPayload = new AggregationRequestPayload(tlvTag);
        this.payloads.push(aggregationRequestPayload);

        return aggregationRequestPayload;
      case AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
        this.aggregatorConfigRequest = new AggregatorConfigRequestPayload(tlvTag);
        this.payloads.push(this.aggregatorConfigRequest);

        return this.aggregatorConfigRequest;
      default:
        return super.parseChild(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    super.validate();

    if (this.getCount(AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType) > 1) {
      throw new TlvError('Only one Aggregator config request payload is allowed in PDU.');
    }
  }
}
