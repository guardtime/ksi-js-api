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

import HashAlgorithm from '@guardtime/gt-js-common/lib/hash/HashAlgorithm';
import {
  EXTEND_REQUEST_PAYLOAD_CONSTANTS,
  EXTEND_REQUEST_PDU_CONSTANTS,
  EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS
} from '../Constants';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { ExtenderConfigRequestPayload } from './ExtenderConfigRequestPayload';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { Pdu } from './Pdu';
import { PduHeader } from './PduHeader';

/**
 * Extend request PDU
 */
export class ExtendRequestPdu extends Pdu {
  private extenderConfigRequest: ExtenderConfigRequestPayload;

  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

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

  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType:
        const extendRequestPayload: ExtendRequestPayload = new ExtendRequestPayload(tlvTag);
        this.payloads.push(extendRequestPayload);

        return extendRequestPayload;
      case EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
        return (this.extenderConfigRequest = new ExtenderConfigRequestPayload(tlvTag));
      default:
        return super.parseChild(tlvTag);
    }
  }

  protected validate(): void {
    super.validate();

    if (this.getCount(EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType) > 1) {
      throw new TlvError('Only one extender config request payload is allowed in PDU.');
    }
  }
}
