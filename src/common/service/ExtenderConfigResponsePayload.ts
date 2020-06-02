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
import { EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';

/**
 * Extender configuration response payload TLV object.
 */
export class ExtenderConfigResponsePayload extends PduPayload {
  private maxRequests: IntegerTag | null = null;
  private parentUriList: StringTag[] = [];
  private calendarFirstTime: IntegerTag | null = null;
  private calendarLastTime: IntegerTag | null = null;

  /**
   * Extender configuration response payload TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get calendar beginning.
   * @returns Calendar beginning, null if value is not set.
   */
  public getCalendarFirstTime(): BigInteger | null {
    return this.calendarFirstTime === null ? null : this.calendarFirstTime.getValue();
  }

  /**
   * Get calendar ending.
   * @returns Calendar ending, null if value is not set.
   */
  public getCalendarLastTime(): BigInteger | null {
    return this.calendarLastTime === null ? null : this.calendarLastTime.getValue();
  }

  /**
   * Get max amount of requests.
   * @returns Amount of requests.
   */
  public getMaxRequests(): BigInteger | null {
    return this.maxRequests === null ? null : this.maxRequests.getValue();
  }

  /**
   * Get parent URI list.
   * @returns Parent URI list.
   */
  public getParentUriList(): string[] {
    return this.parentUriList.map((parentUri: StringTag) => {
      return parentUri.getValue();
    });
  }

  /**
   * Parse child element to correct object.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
        return (this.maxRequests = new IntegerTag(tlvTag));
      case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
        const uriTag: StringTag = new StringTag(tlvTag);
        this.parentUriList.push(uriTag);

        return uriTag;
      case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType:
        return (this.calendarFirstTime = new IntegerTag(tlvTag));
      case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
        return (this.calendarLastTime = new IntegerTag(tlvTag));
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }

  /**
   * Validate current TLV object format.
   */
  protected validate(): void {
    if (this.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType) > 1) {
      throw new TlvError('Only one max requests tag is allowed in Extender config response payload.');
    }

    if (this.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType) > 1) {
      throw new TlvError('Only one calendar first time tag is allowed in Extender config response payload.');
    }

    if (this.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
      throw new TlvError('Only one calendar last time tag is allowed in Extender config response payload.');
    }
  }
}
