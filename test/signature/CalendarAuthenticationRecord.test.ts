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

import { DataHash } from '@guardtime/common/lib/hash/DataHash.js';
import { HashAlgorithm } from '@guardtime/common/lib/hash/HashAlgorithm.js';
import bigInteger from 'big-integer';

import { CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../../src/common/Constants.js';
import { CompositeTag } from '../../src/common/parser/CompositeTag.js';
import { RawTag } from '../../src/common/parser/RawTag.js';
import { StringTag } from '../../src/common/parser/StringTag.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';
import { PublicationData } from '../../src/common/publication/PublicationData.js';
import { CalendarAuthenticationRecord } from '../../src/common/signature/CalendarAuthenticationRecord.js';
import { SignatureData } from '../../src/common/signature/SignatureData.js';

/**
 * Aggregation hash chain TLV tag tests
 */
describe('CalendarAuthenticationRecord', () => {
  it('Creation with TlvTag', async () => {
    const signatureDataTlv: TlvTag = CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x1, 0x2])),
      StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type'),
      RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4])),
    ]);

    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        signatureDataTlv,
      ]
    );

    const record: CalendarAuthenticationRecord = new CalendarAuthenticationRecord(tlvTag);
    expect(
      record
        .getPublicationData()
        .equals(PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))))
    ).toBeTruthy();
    expect(record.getSignatureData().equals(new SignatureData(signatureDataTlv))).toBeTruthy();
  });

  it('Creation with TlvTag missing publication data', async () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [
        CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x1, 0x2])),
          StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type'),
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4])),
        ]),
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one published data must exist in calendar authentication record.');
  });

  it('Creation with TlvTag multiple publication data', async () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x1, 0x2])),
          StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type'),
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4])),
        ]),
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one published data must exist in calendar authentication record.');
  });

  it('Creation with TlvTag missing signature data', async () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one signature data must exist in calendar authentication record.');
  });

  it('Creation with TlvTag multiple signature data', async () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x1, 0x2])),
          StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type'),
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4])),
        ]),
        CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x5, 0x6])),
          StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type2'),
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x7, 0x8])),
        ]),
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one signature data must exist in calendar authentication record.');
  });
});
