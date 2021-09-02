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

import { UnsignedLongCoder } from '@guardtime/common';
import { BigInteger } from 'big-integer';
import { TlvTag } from './TlvTag.js';

/**
 * Integer TLV object.
 */
export class IntegerTag extends TlvTag {
  private readonly value: BigInteger;

  /**
   * Integer TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    const bytes: Uint8Array = tlvTag.getValueBytes();
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes, tlvTag.tlv16BitFlag);
    this.value = UnsignedLongCoder.decode(bytes, 0, bytes.length);
    Object.freeze(this);
  }

  /**
   * Create integer TLV object from value.
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value Unsigned long value.
   * @returns Integer TLV object.
   */
  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: BigInteger): IntegerTag {
    return new IntegerTag(new TlvTag(id, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(value)));
  }

  /**
   * Get TLV object value
   * @returns TLV object value.
   */
  public getValue(): BigInteger {
    return this.value;
  }

  /**
   * Serialize current integer TLV object to string.
   * @returns Serialized TLV object.
   */
  public toString(): string {
    let result = `TLV[0x${this.id.toString(16)}`;
    if (this.nonCriticalFlag) {
      result += ',N';
    }

    if (this.forwardFlag) {
      result += ',F';
    }

    result += `]:i${this.value}`;

    return result;
  }
}
