import {CertificateRecordConstants, PublicationsFileConstants, PublicationsFileHeaderConstants} from "../Constants";
import CompositeTag, {ITlvCount} from "../parser/CompositeTag";
import RawTag from "../parser/RawTag";
import TlvOutputStream from "../parser/TlvOutputStream";
import TlvTag from "../parser/TlvTag";
import CertificateRecord from "./CertificateRecord";
import IPublicationsFile from "./IPublicationsFile";
import PublicationRecord from "./PublicationRecord";
import PublicationsFileError from "./PublicationsFileError";
import PublicationsFileHeader from "./PublicationsFileHeader";

export default class PublicationsFile extends CompositeTag implements IPublicationsFile {
    public static readonly FileBeginningMagicBytes = new Uint8Array([0x4b, 0x53, 0x49, 0x50, 0x55, 0x42, 0x4c, 0x46]);

    private readonly certificateRecordList: CertificateRecord[];
    private cmsSignature: RawTag;
    private publicationRecordList: PublicationRecord[];
    private publicationsFileHeader: PublicationsFileHeader;
    private headerIndex: number = 0;
    private lastCertificateRecordIndex: number = 0;
    private firstPublicationRecordIndex: number = 0;
    private cmsSignatureIndex: number = 0;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create);
        this.validateValue(this.validate);

        Object.freeze(this);
    }

    public findCertificateById(certificateId: Uint8Array): CertificateRecord | null {
        // TODO: Check input param
        const certificateIdString = JSON.stringify(certificateId);
        for (const certificateRecord of this.certificateRecordList) {
            if (certificateIdString === JSON.stringify(certificateRecord.certificateId)) {
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

            if (publicationRecord.publicationTime.compareTo(latestPublicationRecord.publicationTime) > 0) {
                latestPublicationRecord = publicationRecord;
            }
        }

        return latestPublicationRecord;
    }

    public getNearestPublicationRecord(unixTime: number): PublicationRecord | null {
        let nearestPublicationRecord: PublicationRecord | null = null;
        for (const publicationRecord of this.publicationRecordList) {
            const publicationTime = publicationRecord.publicationTime;
            if (publicationTime.compareTo(unixTime) < 0) {
                continue;
            }

            if (nearestPublicationRecord == null) {
                nearestPublicationRecord = publicationRecord;
                continue;
            }

            if (publicationTime.compareTo(nearestPublicationRecord.publicationTime) < 0) {
                nearestPublicationRecord = publicationRecord;
            }
        }

        return nearestPublicationRecord;
    }

    public getSignatureValue(): Uint8Array {
        return this.cmsSignature.getValue();
    }

    public getSignedBytes(): Uint8Array {
        const stream = new TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        for (const tlvTag of this.value) {
            stream.writeTag(tlvTag);
        }

        return stream.getData();
    }

    private create(tlvTag: TlvTag, position: number): TlvTag {
        switch (tlvTag.type) {
            case PublicationsFileHeaderConstants.TagType:
                this.headerIndex = position;
                return this.publicationsFileHeader = new PublicationsFileHeader(tlvTag);
            case CertificateRecordConstants.TagType:
                this.lastCertificateRecordIndex = position;
                const certificateRecord = new CertificateRecord(tlvTag);
                this.certificateRecordList.push(certificateRecord);
                return certificateRecord;
            case PublicationsFileConstants.PublicationRecordTagType:
                if (this.firstPublicationRecordIndex === 0) {
                    this.firstPublicationRecordIndex = position;
                }
                const publicationRecord = new PublicationRecord(tlvTag);
                this.publicationRecordList.push(publicationRecord);
                return publicationRecord;
            case PublicationsFileConstants.CmsSignatureTagType:
                this.cmsSignatureIndex = position;
                return this.cmsSignature = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount) {
        if (this.headerIndex !== 0) {
            throw new PublicationsFileError(
                "Publications file header should be the first element in publications file.");
        }

        if (this.firstPublicationRecordIndex <= this.lastCertificateRecordIndex) {
            throw new PublicationsFileError("Certificate records should be before publication records.");
        }

        if (this.cmsSignatureIndex !== this.value.length - 1) {
            throw new PublicationsFileError("Cms signature should be last element in publications file.");
        }

        if (tagCount[PublicationsFileHeaderConstants.TagType] !== 1) {
            throw new PublicationsFileError("Exactly one publications file header must exist in publications file.");
        }

        if (tagCount[PublicationsFileConstants.CmsSignatureTagType] !== 1) {
            throw new PublicationsFileError("Exactly one signature must exist in publications file.");
        }
    }
}
