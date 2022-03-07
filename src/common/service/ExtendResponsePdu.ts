/*
 * Copyright 2013-2022 Guardtime, Inc.
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
  ERROR_PAYLOAD_CONSTANTS,
  EXTEND_RESPONSE_PAYLOAD_CONSTANTS,
  EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS,
} from '../Constants.js';
import { TlvTag } from '../parser/TlvTag.js';
import { ExtenderConfigResponsePayload } from './ExtenderConfigResponsePayload.js';
import { ExtendErrorPayload } from './ExtendErrorPayload.js';
import { ExtendResponsePayload } from './ExtendResponsePayload.js';
import { Pdu } from './Pdu.js';
import { PduPayload } from './PduPayload.js';

/**
 * Extend response PDU TLV object.
 */
export class ExtendResponsePdu extends Pdu {
  private extenderConfigResponse: ExtenderConfigResponsePayload | null = null;

  /**
   * Extend response PDU TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get all extend response payloads.
   * @returns Aggregation response payloads.
   */
  public getExtendResponsePayloads(): PduPayload[] {
    return this.payloads.filter((payload) => payload.id === EXTEND_RESPONSE_PAYLOAD_CONSTANTS.TagType);
  }

  /**
   * Get Extender config response payload.
   * @returns Extender config response, if missing then null.
   */
  public getExtenderConfigResponsePayload(): ExtenderConfigResponsePayload | null {
    return this.extenderConfigResponse;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
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
