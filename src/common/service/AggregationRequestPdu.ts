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

import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import {
  AGGREGATION_REQUEST_PAYLOAD_CONSTANTS,
  AGGREGATION_REQUEST_PDU_CONSTANTS,
  AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS
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
      throw new TlvError('Only one aggregator config request payload is allowed in PDU.');
    }
  }
}
