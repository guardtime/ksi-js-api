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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import { TlvTag } from './TlvTag';

/**
 * DataHash TLV object
 */
export class ImprintTag extends TlvTag {
  private readonly value: DataHash;

  constructor(tlvTag: TlvTag) {
    const valueBytes: Uint8Array = tlvTag.getValueBytes();
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
    this.value = new DataHash(valueBytes);
    Object.freeze(this);
  }

  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: DataHash): ImprintTag {
    return new ImprintTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value.imprint));
  }

  public getValue(): DataHash {
    return this.value;
  }

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
