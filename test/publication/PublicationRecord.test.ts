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

import { HashAlgorithm, DataHash } from '@guardtime/common';
import bigInteger from 'big-integer';

import { PUBLICATION_RECORD_CONSTANTS, PUBLICATIONS_FILE_CONSTANTS } from '../../src/common/Constants.js';
import { CompositeTag } from '../../src/common/parser/CompositeTag.js';
import { StringTag } from '../../src/common/parser/StringTag.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';
import { PublicationData } from '../../src/common/publication/PublicationData.js';
import { PublicationRecord } from '../../src/common/publication/PublicationRecord.js';

/**
 * Certificate record TLV tag tests
 */
describe('PublicationRecord', () => {
  it('Creation with TlvTag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        StringTag.CREATE(PUBLICATION_RECORD_CONSTANTS.PublicationReferencesTagType, false, false, 'Test'),
        StringTag.CREATE(PUBLICATION_RECORD_CONSTANTS.PublicationReferencesTagType, false, false, 'Kuki'),
        StringTag.CREATE(
          PUBLICATION_RECORD_CONSTANTS.PublicationRepositoryUriTagType,
          false,
          false,
          'http://localhost'
        ),
      ]
    );

    const publicationRecord: PublicationRecord = new PublicationRecord(tlvTag);
    expect(publicationRecord.getPublicationTime()).toEqual(bigInteger(2));
    expect(publicationRecord.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    expect(publicationRecord.getPublicationReferences()).toEqual(['Test', 'Kuki']);
    expect(publicationRecord.getPublicationRepositories()).toEqual(['http://localhost']);
  });

  it('Creation with only publication data', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType,
      false,
      false,
      [PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))]
    );

    const publicationRecord: PublicationRecord = new PublicationRecord(tlvTag);
    expect(publicationRecord.getPublicationTime()).toEqual(bigInteger(2));
    expect(publicationRecord.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    expect(publicationRecord.getPublicationReferences()).toEqual([]);
    expect(publicationRecord.getPublicationRepositories()).toEqual([]);
  });

  it('Creation with missing publication data', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType,
      false,
      false,
      []
    );

    expect(() => {
      return new PublicationRecord(tlvTag);
    }).toThrow('Exactly one published data must exist in publication record.');
  });

  it('Creation with multiple publication data', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        PublicationData.CREATE(bigInteger(3), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
      ]
    );

    expect(() => {
      return new PublicationRecord(tlvTag);
    }).toThrow('Exactly one published data must exist in publication record.');
  });
});
