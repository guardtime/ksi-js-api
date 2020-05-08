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

import { TlvTag } from './TlvTag';

/**
 * Byte array TLV object.
 */
export class RawTag extends TlvTag {
  /**
   * Get TLV object value.
   * @returns Value bytes
   */
  public getValue: () => Uint8Array;

  /**
   * Byte array TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
    this.getValue = (): Uint8Array => tlvTag.getValueBytes();
    Object.freeze(this);
  }

  /**
   * Create byte array TLV object from value bytes.
   * @param id TLV id.
   * @param nonCriticalFlag Is TLV non critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value Value bytes.
   * @returns Byte array TLV object.
   */
  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag {
    return new RawTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value));
  }
}
