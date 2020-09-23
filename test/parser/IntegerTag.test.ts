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

import bigInteger from 'big-integer';
import { IntegerTag } from '../../src/common/parser/IntegerTag';
import { TlvTag } from '../../src/common/parser/TlvTag';

/**
 * IntegerTag tests
 */
describe('IntegerTag', () => {
  it('Creation from tlvTag', () => {
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x61, 0xa8]));
    const objectTag: IntegerTag = new IntegerTag(tlvTag);
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual(bigInteger(25000));
  });

  it('Creation with CREATE', () => {
    const objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual(bigInteger(25000));
  });

  it('toString output', () => {
    let objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
    expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:i25000');
    objectTag = IntegerTag.CREATE(0x20, false, false, bigInteger(25000));
    expect(objectTag.toString()).toEqual('TLV[0x20]:i25000');
  });

  it('Value cannot be changed', () => {
    const objectTag: IntegerTag = IntegerTag.CREATE(0x1, false, false, bigInteger(25000));
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      objectTag.value = 5000;
    }).toThrow(TypeError);
  });
});
