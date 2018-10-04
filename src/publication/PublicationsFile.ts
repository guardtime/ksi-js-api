import BigInteger from 'node_modules/big-integer/BigInteger';
import {CERTIFICATE_RECORD_CONSTANTS, PUBLICATIONS_FILE_CONSTANTS, PUBLICATIONS_FILE_HEADER_CONSTANTS} from 'src/Constants';
import {CompositeTag, ITlvCount} from 'src/parser/CompositeTag';
import {RawTag} from 'src/parser/RawTag';
import {TlvOutputStream} from 'src/parser/TlvOutputStream';
import {TlvTag} from 'src/parser/TlvTag';
import {CertificateRecord} from 'src/publication/CertificateRecord';
import {IPublicationsFile} from 'src/publication/IPublicationsFile';
import {PublicationRecord} from 'src/publication/PublicationRecord';
import {PublicationsFileError} from 'src/publication/PublicationsFileError';
import {PublicationsFileHeader} from 'src/publication/PublicationsFileHeader';

export class PublicationsFile extends CompositeTag implements IPublicationsFile {
    public static get FileBeginningMagicBytes(): Uint8Array {
        return new Uint8Array([0x4B, 0x53, 0x49, 0x50, 0x55, 0x42, 0x4B, 0x46]);
    }

    private readonly certificateRecordList: CertificateRecord[] = [];
    private cmsSignature: RawTag;
    private readonly publicationRecordList: PublicationRecord[] = [];
    private publicationsFileHeader: PublicationsFileHeader;
    private headerIndex: number = 0;
    private lastCertificateRecordIndex: number = 0;
    private firstPublicationRecordIndex: number = 0;
    private cmsSignatureIndex: number = 0;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    // TODO: Check input param
    public findCertificateById(certificateId: Uint8Array): CertificateRecord | null {
        const certificateIdString: string = JSON.stringify(certificateId);
        for (const certificateRecord of this.certificateRecordList) {
            if (certificateIdString === JSON.stringify(certificateRecord.getCertificateId())) {
                return certificateRecord;
            }
        }

        return null;
    }

    public getLatestPublication(): PublicationRecord | null {
        let latestPublicationRecord: PublicationRecord | null = null;
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

    public getNearestPublicationRecord(unixTime: number): PublicationRecord | null {
        let nearestPublicationRecord: PublicationRecord | null = null;
        for (const publicationRecord of this.publicationRecordList) {
            const publicationTime: BigInteger.BigInteger = publicationRecord.getPublicationTime();
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

    public getSignatureValue(): Uint8Array {
        return this.cmsSignature.getValue();
    }

    public getSignedBytes(): Uint8Array {
        const stream: TlvOutputStream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        for (const tlvTag of this.value) {
            stream.writeTag(tlvTag);
        }

        return stream.getData();
    }

    private create(tlvTag: TlvTag, position: number): TlvTag {
        switch (tlvTag.id) {
            case PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType:
                this.headerIndex = position;

                return this.publicationsFileHeader = new PublicationsFileHeader(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.TagType:
                this.lastCertificateRecordIndex = position;
                const certificateRecord: CertificateRecord = new CertificateRecord(tlvTag);
                this.certificateRecordList.push(certificateRecord);

                return certificateRecord;
            case PUBLICATIONS_FILE_CONSTANTS.PublicationRecordTagType:
                if (this.firstPublicationRecordIndex === 0) {
                    this.firstPublicationRecordIndex = position;
                }

                const publicationRecord: PublicationRecord = new PublicationRecord(tlvTag);
                this.publicationRecordList.push(publicationRecord);

                return publicationRecord;
            case PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType:
                this.cmsSignatureIndex = position;

                return this.cmsSignature = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (this.headerIndex !== 0) {
            throw new PublicationsFileError(
                'Publications file header should be the first element in publications file.');
        }

        if (this.firstPublicationRecordIndex <= this.lastCertificateRecordIndex) {
            throw new PublicationsFileError('Certificate records should be before publication records.');
        }

        if (this.cmsSignatureIndex !== this.value.length - 1) {
            throw new PublicationsFileError('Cms signature should be last element in publications file.');
        }

        if (tagCount[PUBLICATIONS_FILE_HEADER_CONSTANTS.TagType] !== 1) {
            throw new PublicationsFileError('Exactly one publications file header must exist in publications file.');
        }

        if (tagCount[PUBLICATIONS_FILE_CONSTANTS.CmsSignatureTagType] !== 1) {
            throw new PublicationsFileError('Exactly one signature must exist in publications file.');
        }
    }
}
