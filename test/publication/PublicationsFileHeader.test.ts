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

import { PUBLICATIONS_FILE_HEADER_CONSTANTS } from '../../src/common/Constants.js';
import { CompositeTag } from '../../src/common/parser/CompositeTag.js';
import { IntegerTag } from '../../src/common/parser/IntegerTag.js';
import { StringTag } from '../../src/common/parser/StringTag.js';
import { PublicationsFileHeader } from '../../src/common/publication/PublicationsFileHeader.js';

/**
 * Certificate record TLV tag tests
 */
describe('PublicationsFileHeader', () => {
  it('Creation with TlvTag', () => {
    const publicationsFileHeader: PublicationsFileHeader = new PublicationsFileHeader(
      CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
        IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
        IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
        StringTag.CREATE(
          PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType,
          false,
          false,
          'http://localhost/test'
        ),
      ])
    );

    expect(publicationsFileHeader.getVersion()).toEqual(bigInteger(5));
    expect(publicationsFileHeader.getCreationTime()).toEqual(bigInteger(1));
    expect(publicationsFileHeader.getRepositoryUri()).toEqual('http://localhost/test');
  });

  it('Creation with missing repository uri', () => {
    const publicationsFileHeader: PublicationsFileHeader = new PublicationsFileHeader(
      CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
        IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
        IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
      ])
    );

    expect(publicationsFileHeader.getRepositoryUri()).toEqual(null);
  });

  it('Creation with missing version', () => {
    expect(() => {
      return new PublicationsFileHeader(
        CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
        ])
      );
    }).toThrow('Exactly one version must exist in publications file header.');
  });

  it('Creation with missing creation time', () => {
    expect(() => {
      return new PublicationsFileHeader(
        CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
        ])
      );
    }).toThrow('Exactly one creation time must exist in publications file header.');
  });

  it('Creation with multiple version', () => {
    expect(() => {
      return new PublicationsFileHeader(
        CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(6)),
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
        ])
      );
    }).toThrow('Exactly one version must exist in publications file header.');
  });

  it('Creation with multiple creation time', () => {
    expect(() => {
      return new PublicationsFileHeader(
        CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(2)),
        ])
      );
    }).toThrow('Exactly one creation time must exist in publications file header.');
  });

  it('Creation with multiple URI', () => {
    expect(() => {
      return new PublicationsFileHeader(
        CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
          IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
          StringTag.CREATE(
            PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType,
            false,
            false,
            'http://localhost/test'
          ),
          StringTag.CREATE(
            PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType,
            false,
            false,
            'http://localhost/broken'
          ),
        ])
      );
    }).toThrow('Only one repository URI is allowed in publications file header.');
  });
});
