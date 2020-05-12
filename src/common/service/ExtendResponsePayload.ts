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
import { CALENDAR_HASH_CHAIN_CONSTANTS, EXTEND_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { RequestResponsePayload } from './RequestResponsePayload';

/**
 * Extend response payload TLV object.
 */
export class ExtendResponsePayload extends RequestResponsePayload {
  private calendarLastTime: IntegerTag | null = null;
  private calendarHashChain: CalendarHashChain;

  /**
   * Extend response payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get calendar hash chain.
   * @returns Calendar hash chain.
   */
  public getCalendarHashChain(): CalendarHashChain {
    return this.calendarHashChain;
  }

  /**
   * Get calendar ending.
   * @returns Calendar ending, null if value is not set.
   */
  public getCalendarLastTime(): BigInteger | null {
    return this.calendarLastTime === null ? null : this.calendarLastTime.getValue();
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
        return (this.calendarLastTime = new IntegerTag(tlvTag));
      case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
        return (this.calendarHashChain = new CalendarHashChain(tlvTag));
      default:
        return super.parseChild(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    super.validate();

    if (this.getCount(EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
      throw new TlvError('Only one calendar last time is allowed in extend response payload.');
    }

    if (this.getStatus().eq(0) && this.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) !== 1) {
      throw new TlvError('Exactly one calendar hash chain must exist in extend response payload.');
    }
  }
}
