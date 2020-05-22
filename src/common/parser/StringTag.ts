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

import Utf8Converter from '@guardtime/common/lib/strings/Utf8Converter';
import { TlvError } from './TlvError';
import { TlvTag } from './TlvTag';

/**
 * String TLV object.
 */
export class StringTag extends TlvTag {
  private readonly value: string;

  /**
   * String TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    const valueBytes: Uint8Array = tlvTag.getValueBytes();
    if (valueBytes.length < 1) {
      throw new TlvError(`Invalid null terminated string length: ${valueBytes.length}`);
    }

    if (valueBytes[valueBytes.length - 1] !== 0) {
      throw new TlvError('String must be null terminated');
    }

    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
    this.value = Utf8Converter.ToString(valueBytes.slice(0, -1));
    Object.freeze(this);
  }

  /**
   * Create string TLV object from string.
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value
   * @returns String TLV object.
   */
  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string): StringTag {
    return new StringTag(new TlvTag(id, nonCriticalFlag, forwardFlag, Utf8Converter.ToBytes(`${value}\0`)));
  }

  /**
   * Get TLV object value.
   * @returns UTF-8 string value.
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Serialize current string TLV object to string.
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

    result += ']:';

    result += `"${this.value}"`;

    return result;
  }
}
