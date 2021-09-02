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
import { PDU_PAYLOAD_CONSTANTS } from '../Constants.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';
import { ResponsePayload } from './ResponsePayload.js';

/**
 * PDU payload base class for requested responses TLV object .
 */
export abstract class RequestResponsePayload extends ResponsePayload {
  private requestId: IntegerTag;

  /**
   * PDU payload base for requested responses TLV object constructor.
   * @param tlvTag TLV object.
   */
  protected constructor(tlvTag: TlvTag) {
    super(tlvTag);
  }

  /**
   * Get request ID.
   * @returns Request ID.
   */
  public getRequestId(): BigInteger {
    return this.requestId.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
        return (this.requestId = new IntegerTag(tlvTag));
      default:
        return super.parseChild(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    super.validate();

    if (this.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
      throw new TlvError('Exactly one request ID must exist in response payload.');
    }
  }
}
