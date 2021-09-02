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

import { DataHash, HashAlgorithm } from '@guardtime/common';
import { ImprintTag } from '../../src/common/parser/ImprintTag.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * ImprintTag tests
 */
describe('ImprintTag', () => {
  it('Creation from tlvTag', () => {
    const valueBytes: Uint8Array = new Uint8Array(33);
    valueBytes.set([0x1]);
    const tlvTag: TlvTag = new TlvTag(0x1, true, true, valueBytes);
    const objectTag: ImprintTag = new ImprintTag(tlvTag);
    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
  });

  it('Creation with CREATE', () => {
    const objectTag: ImprintTag = ImprintTag.CREATE(
      0x1,
      true,
      true,
      DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
    );

    expect(objectTag.id).toEqual(0x1);
    expect(objectTag.nonCriticalFlag).toBeTruthy();
    expect(objectTag.forwardFlag).toBeTruthy();
    expect(objectTag.getValue()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
  });

  it('toString output', () => {
    let objectTag: ImprintTag = ImprintTag.CREATE(
      0x1,
      true,
      true,
      DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
    );

    expect(objectTag.toString()).toEqual(
      'TLV[0x1,N,F]:010000000000000000000000000000000000000000000000000000000000000000'
    );
    objectTag = ImprintTag.CREATE(0x20, false, false, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    expect(objectTag.toString()).toEqual(
      'TLV[0x20]:010000000000000000000000000000000000000000000000000000000000000000'
    );
  });

  it('Value cannot be changed', () => {
    const objectTag: ImprintTag = ImprintTag.CREATE(
      0x1,
      true,
      true,
      DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
    );

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      objectTag.value = DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32));
    }).toThrow(TypeError);
  });
});
