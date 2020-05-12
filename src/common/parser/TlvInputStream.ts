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

import { TLV_CONSTANTS } from '../Constants';
import { TlvError } from './TlvError';
import { TlvTag } from './TlvTag';

/**
 * Specialized input stream for decoding TLV data from bytes.
 */
export class TlvInputStream {
  private readonly data: Uint8Array;
  private position: number;
  private readonly length: number;

  /**
   * TLV input stream constructor.
   * @param bytes Data bytes.
   */
  public constructor(bytes: Uint8Array) {
    this.data = new Uint8Array(bytes);
    this.position = 0;
    this.length = bytes.length;
  }

  /**
   * Get stream position.
   * @returns Stream position.
   */
  public getPosition(): number {
    return this.position;
  }

  /**
   * Get stream length.
   * @returns Stream length.
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Read next TLV object from stream.
   * @returns TLV object.
   */
  public readTag(): TlvTag {
    const firstByte: number = this.readByte();
    const tlv16BitFlag: boolean = (firstByte & TLV_CONSTANTS.Tlv16BitFlagBit) !== 0;
    const forwardFlag: boolean = (firstByte & TLV_CONSTANTS.ForwardFlagBit) !== 0;
    const nonCriticalFlag: boolean = (firstByte & TLV_CONSTANTS.NonCriticalFlagBit) !== 0;
    let id: number = firstByte & TLV_CONSTANTS.TypeMask & 0xff;
    let length: number;
    if (tlv16BitFlag) {
      id = (id << 8) | this.readByte();
      length = this.readShort();
    } else {
      length = this.readByte();
    }

    const data: Uint8Array = this.read(length);

    return new TlvTag(id, nonCriticalFlag, forwardFlag, data, tlv16BitFlag);
  }

  /**
   * Read next byte from stream.
   * @throws {TlvError} If available bytes is shorter than read bytes length.
   */
  private readByte(): number {
    if (this.length <= this.position) {
      throw new TlvError('Could not read byte: Premature end of data');
    }

    const byte: number = this.data[this.position] & 0xff;
    this.position += 1;

    return byte;
  }

  /**
   * Read next short int from stream.
   */
  private readShort(): number {
    return (this.readByte() << 8) | this.readByte();
  }

  /**
   * Read number of bytes from stream.
   * @param length Read bytes length.
   * @throws {TlvError} If available bytes is shorter than read bytes length.
   */
  private read(length: number): Uint8Array {
    if (this.length < this.position + length) {
      throw new TlvError(`Could not read ${length} bytes: Premature end of data`);
    }

    const data: Uint8Array = this.data.subarray(this.position, this.position + length);
    this.position += length;

    return data;
  }
}
