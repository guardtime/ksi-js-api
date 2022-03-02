/*
 * Copyright 2013-2022 Guardtime, Inc.
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

import { HexCoder } from '@guardtime/common';
import { TlvError } from '../../src/common/parser/TlvError.js';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * TlvInputStream tests
 */
describe('TlvInputStream', () => {
  it('Read valid TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('010101'));
    const tlvTag: TlvTag = stream.readTag();
    expect(stream.getPosition()).toEqual(3);
    expect(stream.getLength()).toEqual(3);
    expect(tlvTag.id).toEqual(0x1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
  });

  it('Read 16bit id TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('8001000101'));
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read 16bit length TLV ', () => {
    const stream: TlvInputStream = new TlvInputStream(
      HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`)
    );
    const tlvTag: TlvTag = stream.readTag();
    expect(tlvTag.id).toEqual(1);
    expect(tlvTag.nonCriticalFlag).toBeFalsy();
    expect(tlvTag.forwardFlag).toBeFalsy();
    const valueBytes: Uint8Array = new Uint8Array(256);
    valueBytes.set([0x1]);
    expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
  });

  it('Read TLV with invalid length of data', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01030101'));
    expect(() => {
      stream.readTag();
    }).toThrow(TlvError);
  });

  it('Read TLV with invalid length', () => {
    const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01'));
    expect(() => {
      stream.readTag();
    }).toThrow(TlvError);
  });
});
