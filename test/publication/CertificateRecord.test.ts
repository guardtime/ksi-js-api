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

import {CERTIFICATE_RECORD_CONSTANTS} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {TlvTag} from '../../src/common/parser/TlvTag';
import {CertificateRecord} from '../../src/common/publication/CertificateRecord';

/**
 * Certificate record TLV tag tests
 */
describe('CertificateRecord', () => {
    it('Creation with TlvTag', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4]))
        ]);

        const certificateRecord: CertificateRecord = new CertificateRecord(tlvTag);
        expect(certificateRecord.getCertificateId()).toEqual(new Uint8Array([0x1, 0x2]));
        expect(certificateRecord.getX509Certificate()).toEqual(new Uint8Array([0x3, 0x4]));
    });

    it('Creation with missing certificate id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4]))
        ]);

        expect(() => {
            return new CertificateRecord(tlvTag);
        }).toThrow('Exactly one certificate id must exist in certificate record.');
    });

    it('Creation with missing x509 certificate', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2]))
        ]);

        expect(() => {
            return new CertificateRecord(tlvTag);
        }).toThrow('Exactly one certificate must exist in certificate record.');
    });

    it('Creation with multiple certificate id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([5, 6])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4]))
        ]);

        expect(() => {
            return new CertificateRecord(tlvTag);
        }).toThrow('Exactly one certificate id must exist in certificate record.');
    });

    it('Creation with multiple x509 certificate', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([5, 6]))
        ]);

        expect(() => {
            return new CertificateRecord(tlvTag);
        }).toThrow('Exactly one certificate must exist in certificate record.');
    });
});
