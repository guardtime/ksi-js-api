import { CERTIFICATE_RECORD_CONSTANTS, PUBLICATIONS_FILE_CONSTANTS, PUBLICATIONS_FILE_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { TlvOutputStream } from '../parser/TlvOutputStream';
import { compareTypedArray } from '../util/Array';
import { CertificateRecord } from './CertificateRecord';
import { PublicationRecord } from './PublicationRecord';
import { PublicationsFileError } from './PublicationsFileError';
import { PublicationsFileHeader } from './PublicationsFileHeader';
/**
 * Publications File TLV object
 */
export class PublicationsFile extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.certificateRecordList = [];
        this.publicationRecordList = [];
        this.headerIndex = 0;
        this.lastCertificateRecordIndex = null;
        this.firstPublicationRecordIndex = null;
        this.cmsSignatureIndex = 0;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static get FileBeginningMagicBytes() {
        return new Uint8Array([0x4B, 0x53, 0x49, 0x50, 0x55, 0x42, 0x4C, 0x46]);
    }
    // TODO: Check input param
    findCertificateById(certificateId) {
        for (const certificateRecord of this.certificateRecordList) {
            if (compareTypedArray(certificateId, certificateRecord.getCertificateId())) {
                return certificateRecord;
            }
        }
        return null;
    }
    getLatestPublication() {
        let latestPublicationRecord = null;
        for (const publicationRecord of this.publicationRecordList) {
            if (latestPublicationRecord === null) {
                latestPublicationRecord = publicationRecord;
                continue;
            }
            if (publicationRecord.getPublicationTime().compareTo(latestPublicationRecord.getPublicationTime()) > 0) {
                latestPublicationRecord = publicationRecord;
            }
        }
        return latestPublicationRecord;
    }
    getNearestPublicationRecord(unixTime) {
        let nearestPublicationRecord = null;
        for (const publicationRecord of this.publicationRecordList) {
            const publicationTime = publicationRecord.getPublicationTime();
            if (publicationTime.compareTo(unixTime) < 0) {
                continue;
            }
            if (nearestPublicationRecord == null) {
                nearestPublicationRecord = publicationRecord;
                continue;
            }
            if (publicationTime.compareTo(nearestPublicationRecord.getPublicationTime()) < 0) {
                nearestPublicationRecord = publicationRecord;
            }
        }
        return nearestPublicationRecord;
    }
    getSignatureValue() {
        return this.cmsSignature.getValue();
    }
    getSignedBytes() {
        const stream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        for (const tlvTag of this.value) {
            stream.writeTag(tlvTag);
        }
        return stream.getData();
    }
    parseChild(tlvTag, position) {
        switch (tlvTag.id) {
            case PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType:
                this.headerIndex = position;
                return this.publicationsFileHeader = new PublicationsFileHeader(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.TagType:
                this.lastCertificateRecordIndex = position;
                const certificateRecord = new CertificateRecord(tlvTag);
                this.certificateRecordList.push(certificateRecord);
                return certificateRecord;
            case PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType:
                if (this.firstPublicationRecordIndex === null) {
                    this.firstPublicationRecordIndex = position;
                }
                const publicationRecord = new PublicationRecord(tlvTag);
                this.publicationRecordList.push(publicationRecord);
                return publicationRecord;
            case PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType:
                this.cmsSignatureIndex = position;
                return this.cmsSignature = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType) !== 1) {
            throw new PublicationsFileError('Exactly one publications file header must exist in publications file.');
        }
        if (tagCount.getCount(PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType) !== 1) {
            throw new PublicationsFileError('Exactly one signature must exist in publications file.');
        }
        if (this.headerIndex !== 0) {
            throw new PublicationsFileError('Publications file header should be the first element in publications file.');
        }
        if (this.firstPublicationRecordIndex !== null
            && this.lastCertificateRecordIndex !== null
            && this.firstPublicationRecordIndex <= this.lastCertificateRecordIndex) {
            throw new PublicationsFileError('Certificate records should be before publication records.');
        }
        if (this.cmsSignatureIndex !== this.value.length - 1) {
            throw new PublicationsFileError('Cms signature should be last element in publications file.');
        }
    }
}
