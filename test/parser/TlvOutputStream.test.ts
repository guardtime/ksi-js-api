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

import { RawTag } from '../../src/common/parser/RawTag.js';
import { TlvError } from '../../src/common/parser/TlvError.js';
import { TlvOutputStream } from '../../src/common/parser/TlvOutputStream.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * TlvOutputStream tests
 */
describe('TlvOutputStream', () => {
  it('Write valid TLV ', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(1, false, false, new Uint8Array(3));
    stream.writeTag(tlvTag);
    expect(stream.getData()).toMatchObject(new Uint8Array([0x1, 0x3, 0x0, 0x0, 0x0]));
  });

  it('Write valid TLV with flags ', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(1, true, true, new Uint8Array(3));
    stream.writeTag(tlvTag);
    expect(stream.getData()).toMatchObject(new Uint8Array([0x61, 0x3, 0x0, 0x0, 0x0]));
  });

  it('Write valid forced 16bit TLV', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: TlvTag = new TlvTag(0x1, false, false, new Uint8Array(3), true);
    stream.writeTag(tlvTag);
    expect(stream.getData()).toMatchObject(new Uint8Array([0x80, 0x1, 0x0, 0x3, 0x0, 0x0, 0x0]));
  });

  it('Write valid 16bit TLV with large id', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(0x20, false, false, new Uint8Array(3));
    stream.writeTag(tlvTag);
    expect(stream.getData()).toMatchObject(new Uint8Array([0x80, 0x20, 0x0, 0x3, 0x0, 0x0, 0x0]));
  });

  it('Write valid 16bit TLV with large data', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(0x1, false, false, new Uint8Array(256));
    stream.writeTag(tlvTag);
    const bytes: Uint8Array = new Uint8Array(260);
    bytes.set([0x80, 0x1, 0x1, 0x0]);
    expect(stream.getData()).toMatchObject(new Uint8Array(bytes));
  });

  it('Fail to write too large id', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(0x2000, false, false, new Uint8Array(3));
    expect(() => {
      stream.writeTag(tlvTag);
    }).toThrow(TlvError);
  });

  it('Fail to write too large data', () => {
    const stream: TlvOutputStream = new TlvOutputStream();
    const tlvTag: RawTag = RawTag.CREATE(0x1, false, false, new Uint8Array(0x10000));
    expect(() => {
      stream.writeTag(tlvTag);
    }).toThrow(TlvError);
  });
});
