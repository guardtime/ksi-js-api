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

import { CERTIFICATE_RECORD_CONSTANTS } from '../../src/common/Constants.js';
import { CompositeTag } from '../../src/common/parser/CompositeTag.js';
import { RawTag } from '../../src/common/parser/RawTag.js';
import { TlvError } from '../../src/common/parser/TlvError.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';
import { TestCompositeTag } from './TestCompositeTag';

/**
 * CompositeTag tests
 */
describe('CompositeTag', () => {
  it('Encode with non critical unknown tag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, true, false, new Uint8Array([3, 4])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([5, 6])),
    ]);

    const compositeTag: TestCompositeTag = new TestCompositeTag(tlvTag);
    expect(compositeTag.encode()).toEqual(new Uint8Array([135, 2, 0, 12, 1, 2, 1, 2, 66, 2, 3, 4, 1, 2, 5, 6]));
  });

  it('Creation with unknown child tag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
    ]);

    expect(() => {
      return new TestCompositeTag(tlvTag);
    }).toThrow(TlvError);
  });
});
