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

import { StringTag } from '../../src/common/parser/StringTag.js';
import { TlvError } from '../../src/common/parser/TlvError.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * StringTag tests
 */
describe('StringTag', () => {
  it('Creation from tlvTag', () => {
    const tlvTag: TlvTag = new TlvTag(
      0x1,
      true,
      true,
      new Uint8Array([0xe7, 0x88, 0xb1, 0xe6, 0xb2, 0x99, 0xe5, 0xb0, 0xbc, 0xe4, 0xba, 0x9a, 0x00])
    );
    const objectTag: StringTag = new StringTag(tlvTag);
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual('爱沙尼亚');
  });

  it('Creation with Create', () => {
    const objectTag: StringTag = StringTag.CREATE(0x1, true, true, 'TEST');
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual('TEST');
  });

  it('toString output', () => {
    let objectTag: StringTag = StringTag.CREATE(0x1, true, true, 'TEST');
    expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:"TEST"');
    objectTag = StringTag.CREATE(0x20, false, false, 'TEST');
    expect(objectTag.toString()).toEqual('TLV[0x20]:"TEST"');
  });

  it('Value cannot be changed', () => {
    const objectTag: StringTag = StringTag.CREATE(0x1, false, false, 'TEST');
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      objectTag.value = 'FAIL';
    }).toThrow(TypeError);
  });

  it('Fail creation with invalid string length', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([]));
    expect(() => {
      return new StringTag(tlvTag);
    }).toThrow(TlvError);
  });

  it('Fail creation with not null terminated string', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54]));
    expect(() => {
      return new StringTag(tlvTag);
    }).toThrow(TlvError);
  });
});
