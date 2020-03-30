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
import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import bigInteger from 'big-integer';

import { CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { RawTag } from '../../src/common/parser/RawTag';
import { StringTag } from '../../src/common/parser/StringTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
import { PublicationData } from '../../src/common/publication/PublicationData';
import { CalendarAuthenticationRecord } from '../../src/common/signature/CalendarAuthenticationRecord';
import { SignatureData } from '../../src/common/signature/SignatureData';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { KsiSignature } from '../../src/common/signature/KsiSignature';

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

  it('', () => {
    const signature = new KsiSignature(new TlvInputStream(Base64Coder.decode('iAAEYogFATAwCAIEXX0ymAQAgAsBIgEWMS4yLjg0MC4xMTM1NDkuMS4xLjExAIACAQBy/YC5vTXvfbHrBX16GKw6Y4iYDyugZxz49E7gUEmRD6dPAxLoK8wj3tE5YSX4D7OCPnX4qbwSPWF5Ae20+M6LKgzn7G8FWpahYoYosIRyMx0wXHqau6QKG0zsO7fwa1gee/9uJmKuZJrDNJEzWSSJtKyy2MVL91TejHK3d95TUq4nBL2dRIa4Wwo2fVzatDrnJ68/KQeMEm8YuqteH0W2SknIpkznTKz1pknaNQqMIRXu1LHEdFHgZguMBBFWwHAs0EukCWlHyYlL3J25dgvbM9DKbqZwlvS5h1jLyXaPLwyHjsmYawwUohwsqwjNoxkSTscg0h1HItl3Ti80SkiMAwQZixsniAICggEEXX0ymAIEXX0ymAUhAcyHa0lN/K+qWjcfXXKOA8fd/viVNrEY6lJDpz31RnJaCCEBbSa8goLpBmhgVOjmrxGN83TZy9d7f3RsPlGWOs1SXf0IIQGGEiPkNrJJDVw12jYdKpCaEUiGe2Zei7DaLhd1tD4H/wghASDp23CSacm4TSIejSZPpmqNgmWxXOV1BXPqRNSGSB4ECCEBtuNu92tZdZQxznLfLnarUpXOAiFz2iAaNchPQ5cgVVgIIQFQM50JV2wacd4D40pLqnFkM5+ENoqaU69BJXt4pi2YQQghAeGzt5t+eFqw5U2UWZGzAKDAfHgZpQezYH6o3TsH45zvCCEB77ZSOk2XtwohR4MMQZ8bKj2rRsdcA4CeHNeEVUqszPAIIQEOMeNFRf0KOOmVFoeRXRHLxzaWt5ft6GBQUmIA2XRhOQghAUYIHWLAc19POJm03mw7c+mKVyryvY0aIFv/SWl7kS0xCCEBuBxpWUUPLmZoxdDJFpBCHHDLXyfcIkm+hVTvq9T7DNoIIQE8gifFfRaMEbql0AfRHltZzbh1WxM4vooR1iudKXIligghAS0TiA4H9EvOWlQRi7PmAi+SGpWShqrAHbpRhIZnmeLDCCEBuhItBtPqQg9ZauznUBo3YG36/mBJUTHBg+q3jRq9BhcIIQFWt7cyECrbobXY3EICS8corKAULzVouetlR1B5hrZQ1wghAevDqx2GZBWBEwrDxwd7cbZ7ukyRVTDp/km5h2n8jcrrCCEBSW/AEg2FTnU0uZKrMuwwRbINS+4b++RWT9CSzq+gi3IIIQG7RP02pfPN7ntcbfOmCYoJ41MzW2Ap8Ud1AliKfje+AIgBAKQCBF19MpgDAQ0FIQEQs+VNUr/2mZTMYSBvVmKRLS8sNCcIBaFjCg6JoRtm8wYBAQcmAQFRAiEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJgEBLQIhAWX9jwGNTnIx0D3LKSx0LXuCV0T22G/TpRxfKEQ1PAMaByMCIQFUNHBqbf8mcanYDM+mHeNkK/jLwfoeSja9hZE3rbM3gg==')).readTag());
  })
});
