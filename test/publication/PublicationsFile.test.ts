import bigInteger from 'big-integer';
import {DataHash, HashAlgorithm} from 'gt-js-common';

import {
    CERTIFICATE_RECORD_CONSTANTS,
    PUBLICATIONS_FILE_CONSTANTS,
    PUBLICATIONS_FILE_HEADER_CONSTANTS
} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {StringTag} from '../../src/common/parser/StringTag';
import {TlvOutputStream} from '../../src/common/parser/TlvOutputStream';
import {CertificateRecord} from '../../src/common/publication/CertificateRecord';
import {PublicationData} from '../../src/common/publication/PublicationData';
import {PublicationRecord} from '../../src/common/publication/PublicationRecord';
import {PublicationsFile} from '../../src/common/publication/PublicationsFile';
import {PublicationsFileFactory} from '../../src/common/publication/PublicationsFileFactory';
import {PublicationsFileHeader} from '../../src/common/publication/PublicationsFileHeader';

/**
 * Certificate record TLV tag tests
 */
describe('PublicationsFile', () => {
    it('Creation with bytes', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            new CertificateRecord(
                CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x0, 0x1, 0x2])),
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([0x3, 0x4, 0x5]))
                ])));

        stream.writeTag(
            new CertificateRecord(
                CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x6, 0x7, 0x8])),
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([0x1, 0x2, 0x3]))
                ])));

        stream.writeTag(
            new PublicationRecord(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType, false, false, [
                    PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
                ])));

        stream.writeTag(
            new PublicationRecord(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType, false, false, [
                    PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array([
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                    ])))
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        const publicationsFile: PublicationsFile = new PublicationsFileFactory().create(stream.getData());

        expect(publicationsFile.getSignatureValue()).toEqual(new Uint8Array([0x1, 0x2]));
        expect(publicationsFile.getSignedBytes()).toEqual(new Uint8Array([
            75, 83, 73, 80, 85, 66, 75, 70, 135, 1, 0, 30, 1, 1, 5, 2, 1, 1, 3, 22, 104, 116, 116, 112, 58, 47, 47, 108, 111, 99, 97, 108,
            104, 111, 115, 116, 47, 116, 101, 115, 116, 0, 135, 2, 0, 10, 1, 3, 0, 1, 2, 2, 3, 3, 4, 5, 135, 2, 0, 10, 1, 3, 6, 7, 8, 2, 3,
            1, 2, 3, 135, 3, 0, 40, 16, 38, 2, 1, 1, 4, 33, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 135, 3, 0, 40, 16, 38, 2, 1, 2, 4, 33, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 135, 4, 0, 2, 1, 2]));

        expect((<PublicationRecord>publicationsFile.getLatestPublication()).getPublicationTime()).toEqual(bigInteger(2));
        expect((<PublicationRecord>publicationsFile.getLatestPublication()).getPublicationHash()).toEqual(
            DataHash.create(HashAlgorithm.SHA2_256,  new Uint8Array([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ])));

        expect((<PublicationRecord>publicationsFile.getNearestPublicationRecord(bigInteger(0))).getPublicationTime())
            .toEqual(bigInteger(1));
        expect((<PublicationRecord>publicationsFile.getNearestPublicationRecord(bigInteger(0))).getPublicationHash())
            .toEqual(
                DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));

        expect((<CertificateRecord>publicationsFile.findCertificateById(new Uint8Array([0x0, 0x1, 0x2]))).getX509Certificate())
            .toEqual(new Uint8Array([0x3, 0x4, 0x5]));
        expect((<CertificateRecord>publicationsFile.findCertificateById(new Uint8Array([0x6, 0x7, 0x8]))).getX509Certificate())
            .toEqual(new Uint8Array([0x1, 0x2, 0x3]));
    });

    it('Creation without records', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        const publicationsFile: PublicationsFile = new PublicationsFileFactory().create(stream.getData());

        expect(publicationsFile.getLatestPublication()).toEqual(null);
    });

    it('Creation with only publication record', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            new PublicationRecord(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType, false, false, [
                    PublicationData.CREATE(bigInteger(2), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array([
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                    ])))
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        const publicationsFile: PublicationsFile = new PublicationsFileFactory().create(stream.getData());

        expect((<PublicationRecord>publicationsFile.getLatestPublication()).getPublicationTime()).toEqual(bigInteger(2));
        expect((<PublicationRecord>publicationsFile.getLatestPublication()).getPublicationHash()).toEqual(
            DataHash.create(HashAlgorithm.SHA2_256,  new Uint8Array([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ])));
    });

    it('Creation without magic bytes', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Publications file header is incorrect. Invalid publications file magic bytes.');
    });

    it('Creation without header', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Exactly one publications file header must exist in publications file.');
    });

    it('Creation without CMS signature', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Exactly one signature must exist in publications file.');
    });

    it('Creation with multiple header', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));
        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Exactly one publications file header must exist in publications file.');
    });

    it('Creation with multiple CMS signature', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));
        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));
        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Exactly one signature must exist in publications file.');
    });

    it('Creation with header being second element', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        stream.writeTag(
            new CertificateRecord(
                CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x0, 0x1, 0x2])),
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([0x3, 0x4, 0x5]))
                ])));

        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Publications file header should be the first element in publications file.');
    });

    it('Creation with signature not last element', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);

        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        stream.writeTag(
            new PublicationRecord(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType, false, false, [
                    PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
                ])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Cms signature should be last element in publications file.');
    });

    it('Creation with publication record being before certificate record', () => {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);

        stream.writeTag(
            new PublicationsFileHeader(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType, false, false, [
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType, false, false, bigInteger(5)),
                    IntegerTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType, false, false, bigInteger(1)),
                    StringTag.CREATE(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType, false, false, 'http://localhost/test')
                ])));

        stream.writeTag(
            new PublicationRecord(
                CompositeTag.CREATE_FROM_LIST(PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType, false, false, [
                    PublicationData.CREATE(bigInteger(1), DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
                ])));

        stream.writeTag(
            new CertificateRecord(
                CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([0x0, 0x1, 0x2])),
                    RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([0x3, 0x4, 0x5]))
                ])));

        stream.writeTag(
            RawTag.CREATE(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType, false, false, new Uint8Array([0x1, 0x2])));

        expect(() => {
            return new PublicationsFileFactory().create(stream.getData());
        }).toThrow('Certificate records should be before publication records.');
    });
});
