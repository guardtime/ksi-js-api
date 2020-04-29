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
   * @param {TlvTag} tlvTag TLV object.
   */
  constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
    this.validate();

    Object.freeze(this);
  }

  /**
   * Get calendar beginning.
   * @returns {BigInteger|null} Calendar beginning, null if value is not set.
   */
  public getCalendarFirstTime(): BigInteger | null {
    return this.calendarFirstTime === null ? null : this.calendarFirstTime.getValue();
  }

  /**
   * Get calendar ending.
   * @returns {BigInteger|null} Calendar ending, null if value is not set.
   */
  public getCalendarLastTime(): BigInteger | null {
    return this.calendarLastTime === null ? null : this.calendarLastTime.getValue();
  }

  /**
   * Get max amount of requests.
   * @returns {BigInteger} Amount of requests.
   */
  public getMaxRequests(): BigInteger | null {
    return this.maxRequests === null ? null : this.maxRequests.getValue();
  }

  /**
   * Get parent URI list.
   * @returns {string[]} Parent URI list.
   */
  public getParentUriList(): string[] {
    return this.parentUriList.map((parentUri: StringTag) => {
      return parentUri.getValue();
    });
  }

  /**
   * Parse child element to correct object.
   * @param {TlvTag} tlvTag TLV object.
   * @returns {TlvTag} TLV object.
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
      throw new TlvError('Only one max requests tag is allowed in extender config response payload.');
    }

    if (this.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType) > 1) {
      throw new TlvError('Only one calendar first time tag is allowed in extender config response payload.');
    }

    if (this.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
      throw new TlvError('Only one calendar last time tag is allowed in extender config response payload.');
    }
  }
}
