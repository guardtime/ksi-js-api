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

import { HexCoder } from '@guardtime/gt-js-common';
import { TlvTag } from './TlvTag';

/**
 * Byte array TLV object
 */
export class RawTag extends TlvTag {
  public getValue: () => Uint8Array;

  constructor(tlvTag: TlvTag) {
    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
    this.getValue = (): Uint8Array => tlvTag.getValueBytes();
    Object.freeze(this);
  }

  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag {
    return new RawTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value));
  }

  public toString(): string {
    let result = `TLV[0x${this.id.toString(16)}`;
    if (this.nonCriticalFlag) {
      result += ',N';
    }

    if (this.forwardFlag) {
      result += ',F';
    }

    result += `]:${HexCoder.encode(this.getValue())}`;

    return result;
  }
}
