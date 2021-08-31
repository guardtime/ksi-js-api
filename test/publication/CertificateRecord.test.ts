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
import { TlvTag } from '../../src/common/parser/TlvTag.js';
import { CertificateRecord } from '../../src/common/publication/CertificateRecord.js';

/**
 * Certificate record TLV tag tests
 */
describe('CertificateRecord', () => {
  it('Creation with TlvTag', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
    ]);

    const certificateRecord: CertificateRecord = new CertificateRecord(tlvTag);
    expect(certificateRecord.getCertificateId()).toEqual(new Uint8Array([0x1, 0x2]));
    expect(certificateRecord.getX509Certificate()).toEqual(new Uint8Array([0x3, 0x4]));
  });

  it('Creation with missing certificate id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
    ]);

    expect(() => {
      return new CertificateRecord(tlvTag);
    }).toThrow('Exactly one certificate ID must exist in certificate record.');
  });

  it('Creation with missing x509 certificate', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
    ]);

    expect(() => {
      return new CertificateRecord(tlvTag);
    }).toThrow('Exactly one certificate must exist in certificate record.');
  });

  it('Creation with multiple certificate id', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([5, 6])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
    ]);

    expect(() => {
      return new CertificateRecord(tlvTag);
    }).toThrow('Exactly one certificate ID must exist in certificate record.');
  });

  it('Creation with multiple x509 certificate', () => {
    const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
      RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([5, 6])),
    ]);

    expect(() => {
      return new CertificateRecord(tlvTag);
    }).toThrow('Exactly one certificate must exist in certificate record.');
  });
});
