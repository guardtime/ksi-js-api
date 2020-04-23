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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { ImprintTag } from '../../src/common/parser/ImprintTag';
import { TlvTag } from '../../src/common/parser/TlvTag';

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      objectTag.value = DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32));
    }).toThrow(TypeError);
  });
});
