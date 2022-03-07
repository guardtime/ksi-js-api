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

import { BigInteger } from 'big-integer';
import { PDU_PAYLOAD_CONSTANTS } from '../Constants.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { StringTag } from '../parser/StringTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';
import { PduPayload } from './PduPayload.js';

/**
 * PDU payload base TLV object class for responses.
 */
export abstract class ResponsePayload extends PduPayload {
  private status: IntegerTag;
  private errorMessage: StringTag | null = null;

  /**
   * PDU payload base TLV object class constructor.
   * @param tlvTag TLV object.
   */
  protected constructor(tlvTag: TlvTag) {
    super(tlvTag);
  }

  /**
   * Get payload status.
   * @returns Payload status.
   */
  public getStatus(): BigInteger {
    return this.status.getValue();
  }

  /**
   * Get error message.
   * @returns Error message.
   */
  public getErrorMessage(): string | null {
    return this.errorMessage !== null ? this.errorMessage.getValue() : null;
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_PAYLOAD_CONSTANTS.StatusTagType:
        return (this.status = new IntegerTag(tlvTag));
      case PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType:
        return (this.errorMessage = new StringTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    if (this.getCount(PDU_PAYLOAD_CONSTANTS.StatusTagType) !== 1) {
      throw new TlvError('Exactly one status code must exist in response payload.');
    }

    if (this.getCount(PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType) > 1) {
      throw new TlvError('Only one error message is allowed in response payload.');
    }
  }
}
