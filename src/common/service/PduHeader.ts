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

import { PDU_HEADER_CONSTANTS } from '../Constants.js';
import { CompositeTag } from '../parser/CompositeTag.js';
import { IntegerTag } from '../parser/IntegerTag.js';
import { StringTag } from '../parser/StringTag.js';
import { TlvError } from '../parser/TlvError.js';
import { TlvTag } from '../parser/TlvTag.js';

/**
 * PDU header TLV object.
 */
export class PduHeader extends CompositeTag {
  private loginId: StringTag;
  private instanceId: IntegerTag;
  private messageId: IntegerTag;

  /**
   * PDU header TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Create PDU header from login ID.
   * @param loginId Login ID.
   * @returns PDU header.
   */
  public static CREATE_FROM_LOGIN_ID(loginId: string): PduHeader {
    return new PduHeader(
      CompositeTag.CREATE_FROM_LIST(PDU_HEADER_CONSTANTS.TagType, false, false, [
        StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId),
      ]),
    );
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case PDU_HEADER_CONSTANTS.LoginIdTagType:
        return (this.loginId = new StringTag(tlvTag));
      case PDU_HEADER_CONSTANTS.InstanceIdTagType:
        return (this.instanceId = new IntegerTag(tlvTag));
      case PDU_HEADER_CONSTANTS.MessageIdTagType:
        return (this.messageId = new IntegerTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  private validate(): void {
    if (this.getCount(PDU_HEADER_CONSTANTS.LoginIdTagType) !== 1) {
      throw new TlvError('Exactly one login ID must exist in PDU header.');
    }

    if (this.getCount(PDU_HEADER_CONSTANTS.InstanceIdTagType) > 1) {
      throw new TlvError('Only one instance ID is allowed in PDU header.');
    }

    if (this.getCount(PDU_HEADER_CONSTANTS.MessageIdTagType) > 1) {
      throw new TlvError('Only one message ID is allowed in PDU header.');
    }
  }
}
