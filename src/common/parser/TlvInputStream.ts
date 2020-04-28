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
   * @param {Uint8Array} bytes Data bytes.
   */
  constructor(bytes: Uint8Array) {
    this.data = new Uint8Array(bytes);
    this.position = 0;
    this.length = bytes.length;
  }

  /**
   * Get stream position.
   * @returns {number} Stream position.
   */
  public getPosition(): number {
    return this.position;
  }

  /**
   * Get stream length.
   * @returns {number} Stream length.
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Read next TLV object from stream.
   * @returns {TlvTag} TLV object.
   * @throws {TlvError} If available bytes is shorter than TLV object size.
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
   * @throws {TlvError} If available bytes is shorter than read bytes length.
   */
  private readShort(): number {
    return (this.readByte() << 8) | this.readByte();
  }

  /**
   * Read number of bytes from stream.
   * @param {number} length Read bytes length.
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
