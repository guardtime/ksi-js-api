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
  EXTEND_REQUEST_PAYLOAD_CONSTANTS,
  EXTEND_REQUEST_PDU_CONSTANTS,
  EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS
} from '../Constants';
import { TlvTag } from '../parser/TlvTag';
import { ExtenderConfigRequestPayload } from './ExtenderConfigRequestPayload';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { Pdu } from './Pdu';
import { PduHeader } from './PduHeader';

/**
 * Extend request PDU TLV object.
 */
export class ExtendRequestPdu extends Pdu {
  private extenderConfigRequest: ExtenderConfigRequestPayload;

  /**
   * Extend request PDU TLV object constructor.
   * @param tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
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
    key: Uint8Array
  ): Promise<ExtendRequestPdu> {
    return new ExtendRequestPdu(
      await Pdu.CREATE_PDU(EXTEND_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key)
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
