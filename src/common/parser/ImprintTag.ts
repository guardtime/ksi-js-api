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

import { DataHash } from '@guardtime/common';
import { TlvTag } from './TlvTag.js';

/**
 * Imprint TLV object.
 */
export class ImprintTag extends TlvTag {
  private readonly value: DataHash;

  /**
   * Imprint TLV object constructor.
   * @param tlvTag TLV object.
   */
  public constructor(tlvTag: TlvTag) {
    const valueBytes: Uint8Array = tlvTag.getValueBytes();
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
    this.value = new DataHash(valueBytes);
    Object.freeze(this);
  }

  /**
   * Create imprint TLV object from data hash.
   * @param id TLV ID.
   * @param nonCriticalFlag Is TLV non-critical.
   * @param forwardFlag Is TLV forwarded.
   * @param value Data hash.
   * @returns Imprint TLV object.
   */
  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: DataHash): ImprintTag {
    return new ImprintTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value.imprint));
  }

  /**
   * Get TLV object value.
   * @returns Data hash.
   */
  public getValue(): DataHash {
    return this.value;
  }

  /**
   * Serialize current imprint TLV object to string.
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

    result += `]:${this.value.toString()}`;

    return result;
  }
}
