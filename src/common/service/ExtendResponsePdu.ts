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
  AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS,
  ERROR_PAYLOAD_CONSTANTS,
  EXTEND_RESPONSE_PAYLOAD_CONSTANTS,
  EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS
} from '../Constants';
import { TlvTag } from '../parser/TlvTag';
import { ExtenderConfigResponsePayload } from './ExtenderConfigResponsePayload';
import { ExtendErrorPayload } from './ExtendErrorPayload';
import { ExtendResponsePayload } from './ExtendResponsePayload';
import { Pdu } from './Pdu';
import { PduPayload } from './PduPayload';
import { AggregatorConfigResponsePayload } from './AggregatorConfigResponsePayload';

/**
 * Extend response PDU TLV object.
 */
export class ExtendResponsePdu extends Pdu {
  private extenderConfigResponse: ExtenderConfigResponsePayload | null = null;

  /**
   * Extend response PDU TLV object constructor.
   * @param {TlvTag} tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get all extend response payloads.
   * @returns {PduPayload[]} Aggregation response payloads.
   */
  public getExtendResponsePayloads(): PduPayload[] {
    return this.payloads.filter(payload => payload.id === EXTEND_RESPONSE_PAYLOAD_CONSTANTS.TagType);
  }

  /**
   * Get extender config response payload.
   * @returns {ExtenderConfigResponsePayload|null} Extender config response, if missing then null.
   */
  public getExtenderConfigResponsePayload(): ExtenderConfigResponsePayload | null {
    return this.extenderConfigResponse;
  }

  /**
   * Parse child element to correct object.
   * @param {TlvTag} tlvTag TLV object.
   * @returns {TlvTag} TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.TagType:
        const extendResponsePayload: ExtendResponsePayload = new ExtendResponsePayload(tlvTag);
        this.payloads.push(extendResponsePayload);

        return extendResponsePayload;
      case ERROR_PAYLOAD_CONSTANTS.TagType:
        return (this.errorPayload = new ExtendErrorPayload(tlvTag));
      case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
        const configResponsePayload = new ExtenderConfigResponsePayload(tlvTag);
        this.payloads.push(configResponsePayload);
        if (!this.extenderConfigResponse) {
          this.extenderConfigResponse = configResponsePayload;
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
