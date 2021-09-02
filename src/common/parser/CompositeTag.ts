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

import { tabPrefix } from '@guardtime/common';
import { TlvError } from './TlvError.js';
import { TlvInputStream } from './TlvInputStream.js';
import { TlvOutputStream } from './TlvOutputStream.js';
import { TlvTag } from './TlvTag.js';

/**
 * Decode value callback to set parameters and create correct TLV objects.
 *
 * @callback decodeCallback
 * @param tlvTag TLV object.
 * @param position Position in TLV object.
 * @returns Resulting TLV object.
 */

/**
 * Composite TLV object.
 */
export abstract class CompositeTag extends TlvTag {
  public value: TlvTag[] = [];
  private elementCount: { [key: number]: number } = {};

  /**
   * Composite TLV object constructor.
   * @param tlvTag TLV object.
   */
  protected constructor(tlvTag: TlvTag) {
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
  }

  /**
   * Create composite TLV object from TLV list.
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value TLV object list.
   * @param tlv16BitFlag Is TLV with 16-bit length.
   * @returns TLV object.
   */
  public static CREATE_FROM_LIST(
    id: number,
    nonCriticalFlag: boolean,
    forwardFlag: boolean,
    value: TlvTag[],
    tlv16BitFlag = false
  ): TlvTag {
    const stream: TlvOutputStream = new TlvOutputStream();
    for (const tlvTag of value) {
      stream.writeTag(tlvTag);
    }

    return new TlvTag(id, nonCriticalFlag, forwardFlag, stream.getData(), tlv16BitFlag);
  }

  /**
   * Create new TLV object from composite TLV object.
   * @param id TLV ID.
   * @param tlvTag Composite TLV object.
   * @returns TLV object.
   */
  protected static createFromCompositeTag(id: number, tlvTag: CompositeTag): TlvTag {
    return new TlvTag(id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
  }

  /**
   * Validate unknown TLV object, if critical throw TLVError.
   * @param tlvTag TLV object.
   * @returns TLV object.
   */
  protected validateUnknownTlvTag(tlvTag: TlvTag): TlvTag {
    if (!tlvTag.nonCriticalFlag) {
      throw new TlvError(`Unknown TLV tag: 0x${tlvTag.id.toString(16)}`);
    }

    console.warn(`Ignoring TLV tag: 0x${tlvTag.id.toString(16)} in 0x${this.id.toString(16)}`);
    return tlvTag;
  }

  /**
   * Serialize current composite TLV object to string.
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

    result += ']:\n';

    for (let i = 0; i < this.value.length; i += 1) {
      result += tabPrefix(this.value[i].toString());
      if (i < this.value.length - 1) {
        result += '\n';
      }
    }

    return result;
  }

  /**
   * Decode TLV object value bytes to TLV list and get their count.
   * @param createFunc Function to create TLV objects
   */
  protected decodeValue(createFunc: (tlvTag: TlvTag, position: number) => TlvTag): void {
    const valueBytes: Uint8Array = this.getValueBytes();
    const stream: TlvInputStream = new TlvInputStream(valueBytes);
    let position = 0;
    while (stream.getPosition() < stream.getLength()) {
      const tlvTag: TlvTag = createFunc(stream.readTag(), position);
      this.value.push(tlvTag);

      if (!this.elementCount.hasOwnProperty(tlvTag.id)) {
        this.elementCount[tlvTag.id] = 0;
      }

      this.elementCount[tlvTag.id] += 1;
      position += 1;
    }

    Object.freeze(this.elementCount);
  }

  /**
   * Get TLV object count by its ID.
   * @param id TLV object ID.
   * @returns TLV object count.
   */
  public getCount(id: number): number {
    return this.elementCount[id] || 0;
  }
}
