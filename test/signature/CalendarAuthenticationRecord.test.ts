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

import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import HashAlgorithm from '@guardtime/gt-js-common/lib/hash/HashAlgorithm';
import bigInteger from 'big-integer';

import { CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { RawTag } from '../../src/common/parser/RawTag';
import { StringTag } from '../../src/common/parser/StringTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
import { PublicationData } from '../../src/common/publication/PublicationData';
import { CalendarAuthenticationRecord } from '../../src/common/signature/CalendarAuthenticationRecord';
import { SignatureData } from '../../src/common/signature/SignatureData';

/**
 * Aggregation hash chain TLV tag tests
 */
describe('CalendarAuthenticationRecord', () => {
  it('Creation with TlvTag', async () => {
    const signatureDataTlv: TlvTag = CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x1, 0x2])),
      StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type'),
      RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4]))
    ]);

    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(
      CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType,
      false,
      false,
      [
        PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
        signatureDataTlv
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
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4]))
        ])
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one publication data must exist in calendar authentication record.');
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
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4]))
        ])
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one publication data must exist in calendar authentication record.');
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
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x3, 0x4]))
        ]),
        CompositeTag.CREATE_FROM_LIST(SIGNATURE_DATA_CONSTANTS.TagType, false, false, [
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x5, 0x6])),
          StringTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType, false, false, 'signature_type2'),
          RawTag.CREATE(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType, false, false, new Uint8Array([0x7, 0x8]))
        ])
      ]
    );

    expect(() => {
      return new CalendarAuthenticationRecord(tlvTag);
    }).toThrow('Exactly one signature data must exist in calendar authentication record.');
  });
});
