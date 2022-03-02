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

import { RawTag } from '../../src/common/parser/RawTag.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * RawTag tests
 */
describe('RawTag', () => {
  it('Creation from tlvTag', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
    const objectTag: RawTag = new RawTag(tlvTag);
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    expect(objectTag.equals(RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2])))).toBeTruthy();
  });

  it('Creation with CREATE', () => {
    const objectTag: RawTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
  });

  it('toString output', () => {
    let objectTag: RawTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
    expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:0102');
    objectTag = RawTag.CREATE(0x20, false, false, new Uint8Array([0x1, 0x2]));
    expect(objectTag.toString()).toEqual('TLV[0x20]:0102');
  });

  it('Value cannot be changed', () => {
    const bytes: Uint8Array = new Uint8Array([0x1, 0x2]);
    const objectTag: RawTag = RawTag.CREATE(0x1, false, false, bytes);
    bytes.set([0x3, 0x4]);
    expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    objectTag.getValue().set([0x3, 0x4]);
    expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
  });
});
