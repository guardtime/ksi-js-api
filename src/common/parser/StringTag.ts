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

import Utf8Converter from '@guardtime/gt-js-common/lib/strings/Utf8Converter';
import { TlvError } from './TlvError';
import { TlvTag } from './TlvTag';

/**
 * String TLV object
 */
export class StringTag extends TlvTag {
  private readonly value: string;

  constructor(tlvTag: TlvTag) {
    const valueBytes: Uint8Array = tlvTag.getValueBytes();
    if (valueBytes.length < 2) {
      throw new TlvError(`Invalid null terminated string length: ${valueBytes.length}`);
    }

    if (valueBytes[valueBytes.length - 1] !== 0) {
      throw new TlvError('String must be null terminated');
    }

    super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
    this.value = Utf8Converter.ToString(valueBytes.slice(0, -1));
    Object.freeze(this);
  }

  public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string): StringTag {
    return new StringTag(new TlvTag(id, nonCriticalFlag, forwardFlag, Utf8Converter.ToBytes(`${value}\0`)));
  }

  public getValue(): string {
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

    result += ']:';

    result += `"${this.value}"`;

    return result;
  }
}
