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

import { Array, HexCoder } from '@guardtime/common';
import { TLV_CONSTANTS } from '../Constants.js';
import { TlvError } from './TlvError.js';

/**
 * TLV objects base class.
 */
export class TlvTag {
  public readonly id: number;
  public readonly tlv16BitFlag: boolean;
  public readonly nonCriticalFlag: boolean;
  public readonly forwardFlag: boolean;
  public readonly getValueBytes: () => Uint8Array;

  /**
   * TlvTag constructor.
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param valueBytes TLV value bytes.
   * @param tlv16BitFlag Is TLV with 16-bit length.
   */
  public constructor(
    id: number,
    nonCriticalFlag: boolean,
    forwardFlag: boolean,
    valueBytes: Uint8Array,
    tlv16BitFlag = false
  ) {
    this.id = id;
    this.nonCriticalFlag = nonCriticalFlag;
    this.forwardFlag = forwardFlag;
    const valueBytesCopy: Uint8Array = new Uint8Array(valueBytes);
    this.getValueBytes = (): Uint8Array => new Uint8Array(valueBytesCopy);
    this.tlv16BitFlag = tlv16BitFlag;

    if (new.target === TlvTag) {
      Object.freeze(this);
    }
  }

  /**
   * Test if 2 TLV objects are equal.
   * @param x First object to test as TLV.
   * @param y Second object to test as TLV.
   * @returns If 2 TLV are equal return true.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static EQUALS(x: any, y: any): boolean {
    if (!(x instanceof TlvTag) || !(y instanceof TlvTag)) {
      return false;
    }

    if (x === y) {
      return true;
    }

    if (x.constructor.name !== y.constructor.name) {
      return false;
    }

    return !(
      x.id !== y.id ||
      x.forwardFlag !== y.forwardFlag ||
      x.nonCriticalFlag !== y.nonCriticalFlag ||
      !Array.compareUint8Arrays(x.getValueBytes(), y.getValueBytes())
    );
  }

  /**
   * Encode TLV to byte array.
   * @returns Encoded TLV object bytes.
   */
  public encode(): Uint8Array {
    if (this.id > TLV_CONSTANTS.MaxType) {
      throw new TlvError('Could not write TlvTag: Type is larger than max ID');
    }

    const valueBytes: Uint8Array = this.getValueBytes();
    if (valueBytes.length > 0xffff) {
      throw new TlvError('Could not write TlvTag: Data length is too large');
    }

    const tlv16BitFlag: boolean = this.id > TLV_CONSTANTS.TypeMask || valueBytes.length > 0xff || this.tlv16BitFlag;
    let firstByte: number =
      ((tlv16BitFlag && TLV_CONSTANTS.Tlv16BitFlagBit) as number) +
      ((this.nonCriticalFlag && TLV_CONSTANTS.NonCriticalFlagBit) as number) +
      ((this.forwardFlag && TLV_CONSTANTS.ForwardFlagBit) as number);

    let result: Uint8Array;
    if (tlv16BitFlag) {
      firstByte |= (this.id >> 8) & TLV_CONSTANTS.TypeMask;
      result = new Uint8Array(valueBytes.length + 4);
      result.set([firstByte & 0xff, this.id & 0xff, (valueBytes.length >> 8) & 0xff, valueBytes.length & 0xff]);

      result.set(valueBytes, 4);
    } else {
      firstByte |= this.id & TLV_CONSTANTS.TypeMask;

      result = new Uint8Array(valueBytes.length + 2);
      result.set([firstByte, valueBytes.length & 0xff]);
      result.set(valueBytes, 2);
    }

    return result;
  }

  /**
   * Test if current TLV is equal to another object.
   * @param tag TLV object.
   * @returns If tested TLV header and value are equal.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public equals(tag: any): boolean {
    return TlvTag.EQUALS(this, tag);
  }

  /**
   * Serialize current byte array TLV object to string.
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

    result += `]:${HexCoder.encode(this.getValueBytes())}`;

    return result;
  }
}
