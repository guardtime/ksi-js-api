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

import { HashAlgorithm } from '@guardtime/common/lib/hash/HashAlgorithm.js';
import {
  EXTEND_REQUEST_PAYLOAD_CONSTANTS,
  EXTEND_REQUEST_PDU_CONSTANTS,
  EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS,
} from '../Constants.js';
import { TlvTag } from '../parser/TlvTag.js';
import { ExtenderConfigRequestPayload } from './ExtenderConfigRequestPayload.js';
import { ExtendRequestPayload } from './ExtendRequestPayload.js';
import { Pdu } from './Pdu.js';
import { PduHeader } from './PduHeader.js';

/**
 * Extend request PDU TLV object.
 */
export class ExtendRequestPdu extends Pdu {
  private extenderConfigRequest: ExtenderConfigRequestPayload;

  /**
   * Extend request PDU TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Create extend request PDU TLV object from extend request payload.
   * @param header PDU header.
   * @param payload Extend request payload.
   * @param algorithm HMAC algorithm.
   * @param key HMAC key.
   * @returns Extend request PDU promise.
   */
  public static async CREATE(
    header: PduHeader,
    payload: ExtendRequestPayload,
    algorithm: HashAlgorithm,
    key: Uint8Array,
  ): Promise<ExtendRequestPdu> {
    return new ExtendRequestPdu(
      await Pdu.CREATE_PDU(EXTEND_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key),
    );
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType:
        const extendRequestPayload: ExtendRequestPayload = new ExtendRequestPayload(tlvTag);
        this.payloads.push(extendRequestPayload);

        return extendRequestPayload;
      case EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
        this.extenderConfigRequest = new ExtenderConfigRequestPayload(tlvTag);
        this.payloads.push(this.extenderConfigRequest);

        return this.extenderConfigRequest;
      default:
        return super.parseChild(tlvTag);
    }
  }
}
