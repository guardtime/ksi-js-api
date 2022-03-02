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

import { TlvTag } from './TlvTag.js';

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
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value Value bytes.
   * @returns Byte array TLV object.
   */
  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag {
    return new RawTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value));
  }
}
