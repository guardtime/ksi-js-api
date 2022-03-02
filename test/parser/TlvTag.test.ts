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
 * TlvTag tests
 */
describe('TlvTag', () => {
  it('Creation', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
    expect(tlvTag.id).toEqual(0x1);
    expect(tlvTag.nonCriticalFlag).toBeTruthy();
    expect(tlvTag.forwardFlag).toBeTruthy();
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
    expect(tlvTag.tlv16BitFlag).toBeFalsy();
  });

  it('Variables cannot be changed', () => {
    const bytes: Uint8Array = new Uint8Array([0x1, 0x2]);
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, bytes);
    expect(tlvTag.id).toEqual(0x1);
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // noinspection JSConstantReassignment
      tlvTag.id = 1;
    }).toThrow(TypeError);
    expect(tlvTag.nonCriticalFlag).toBeTruthy();
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // noinspection JSConstantReassignment
      tlvTag.nonCriticalFlag = false;
    }).toThrow(TypeError);
    expect(tlvTag.forwardFlag).toBeTruthy();
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // noinspection JSConstantReassignment
      tlvTag.forwardFlag = false;
    }).toThrow(TypeError);
    bytes.set([0x3, 0x4]);
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
    tlvTag.getValueBytes().set([0x3, 0x4]);
    expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
  });

  it('TlvTag equals', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, false, false, new Uint8Array([0x0, 0x1, 0x2]));
    expect(tlvTag.equals(null)).toBeFalsy();
    // tslint:disable-next-line:no-unused-expression
    expect(tlvTag.equals(void TlvTag)).toBeFalsy();
    expect(tlvTag.equals(0)).toBeFalsy();
    expect(tlvTag.equals([])).toBeFalsy();
    expect(tlvTag.equals({})).toBeFalsy();
    expect(tlvTag.equals(new TlvError(''))).toBeFalsy();
    expect(tlvTag.equals(new TlvTag(0x2, false, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
    expect(tlvTag.equals(new TlvTag(0x1, true, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
    expect(tlvTag.equals(new TlvTag(0x1, false, true, new Uint8Array([0x0, 0x1, 0x2])))).toBeFalsy();
    expect(tlvTag.equals(new TlvTag(0x1, false, false, new Uint8Array([0x1, 0x1, 0x2])))).toBeFalsy();
    expect(tlvTag.equals(StringTag.CREATE(0x1, false, false, 'test'))).toBeFalsy();
    expect(tlvTag.equals(new TlvTag(0x1, false, false, new Uint8Array([0x0, 0x1, 0x2])))).toBeTruthy();
  });
});
