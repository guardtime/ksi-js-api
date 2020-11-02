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

import HexCoder from '@guardtime/common/lib/coders/HexCoder';
import DataHash from '@guardtime/common/lib/hash/DataHash';
import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import bigInteger from 'big-integer';

import { PUBLICATION_DATA_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { ImprintTag } from '../../src/common/parser/ImprintTag';
import { IntegerTag } from '../../src/common/parser/IntegerTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
import { PublicationData } from '../../src/common/publication/PublicationData';

/**
 * Certificate record TLV tag tests
 */
describe('PublicationData', () => {
  it('Creation with TlvTag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
      IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
      ImprintTag.CREATE(
        PUBLICATION_DATA_CONSTANTS.PublicationHashTagType,
        false,
        false,
        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
      ),
    ]);

    const publicationData: PublicationData = new PublicationData(tlvTag);
    expect(publicationData.getPublicationTime()).toEqual(bigInteger(2));
    expect(publicationData.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
  });

  it('Creation with CREATE', () => {
    const publicationData: PublicationData = PublicationData.CREATE(
      bigInteger(2),
      DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
    );
    expect(publicationData.getPublicationTime()).toEqual(bigInteger(2));
    expect(publicationData.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
  });

  it('Creation with publication string', () => {
    const publicationData: PublicationData = PublicationData.CREATE_FROM_PUBLICATION_STRING(
      'AAAAAA-C7Q6IQ-AAJBF7-G2ZDFT-AIIUEE-KBHEIR-NHV74X-PKLM6G-JJM6ZC-BIKJEX-VDWBZP-ZYJ4IB'.replace(/-/g, '')
    );

    expect(publicationData.getPublicationTime().toString()).toEqual('1602720000');
    expect(publicationData.getPublicationHash()).toEqual(
      new DataHash(HexCoder.decode('01212FCDAC8CB302114211413911169EBFE5DEA5B3C64A59EC882852497A8EC1CB'))
    );

    expect(
      publicationData
        .toPublicationString()
        .match(/.{1,6}/g)
        ?.join('-')
    ).toEqual('AAAAAA-C7Q6IQ-AAJBF7-G2ZDFT-AIIUEE-KBHEIR-NHV74X-PKLM6G-JJM6ZC-BIKJEX-VDWBZP-ZYJ4IB');
  });

  it('Creation with missing publication time', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
      ImprintTag.CREATE(
        PUBLICATION_DATA_CONSTANTS.PublicationHashTagType,
        false,
        false,
        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
      ),
    ]);

    expect(() => {
      return new PublicationData(tlvTag);
    }).toThrow('Exactly one publication time must exist in published data.');
  });

  it('Creation with missing publication hash', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
      IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
    ]);

    expect(() => {
      return new PublicationData(tlvTag);
    }).toThrow('Exactly one published hash must exist in published data.');
  });

  it('Creation with multiple publication time', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
      IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
      IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
      ImprintTag.CREATE(
        PUBLICATION_DATA_CONSTANTS.PublicationHashTagType,
        false,
        false,
        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
      ),
    ]);

    expect(() => {
      return new PublicationData(tlvTag);
    }).toThrow('Exactly one publication time must exist in published data.');
  });

  it('Creation with multiple publication hash', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
      IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
      ImprintTag.CREATE(
        PUBLICATION_DATA_CONSTANTS.PublicationHashTagType,
        false,
        false,
        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
      ),
      ImprintTag.CREATE(
        PUBLICATION_DATA_CONSTANTS.PublicationHashTagType,
        false,
        false,
        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))
      ),
    ]);

    expect(() => {
      return new PublicationData(tlvTag);
    }).toThrow('Exactly one published hash must exist in published data.');
  });
});
