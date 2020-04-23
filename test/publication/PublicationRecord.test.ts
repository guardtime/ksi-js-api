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
import bigInteger from 'big-integer';

import { PUBLICATION_RECORD_CONSTANTS, PUBLICATIONS_FILE_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { StringTag } from '../../src/common/parser/StringTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
import { PublicationData } from '../../src/common/publication/PublicationData';
import { PublicationRecord } from '../../src/common/publication/PublicationRecord';

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
        StringTag.CREATE(PUBLICATION_RECORD_CONSTANTS.PublicationRepositoryUriTagType, false, false, 'http://localhost')
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
        PublicationData.CREATE(bigInteger(3), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
      ]
    );

    expect(() => {
      return new PublicationRecord(tlvTag);
    }).toThrow('Exactly one published data must exist in publication record.');
  });
});
