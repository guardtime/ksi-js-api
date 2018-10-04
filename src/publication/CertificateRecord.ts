import {CERTIFICATE_RECORD_CONSTANTS} from 'src/Constants';
import {CompositeTag, ITlvCount} from 'src/parser/CompositeTag';
import {RawTag} from 'src/parser/RawTag';
import {TlvError} from 'src/parser/TlvError';
import {TlvTag} from 'src/parser/TlvTag';

/**
 * Certificate Record TLV object
 */
export class CertificateRecord extends CompositeTag {

    private certificateId: RawTag;
    private x509Certificate: RawTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }
    public getX509Certificate(): Uint8Array {
        return this.x509Certificate.getValue();
    }

    public getCertificateId(): Uint8Array {
        return this.certificateId.getValue();
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
                return this.certificateId = new RawTag(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType:
                return this.x509Certificate = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType] !== 1) {
            throw new TlvError('Certificate Id is missing.');
        }

        if (tagCount[CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType] !== 1) {
            throw new TlvError('Exactly one certificate must exist in certificate record.');
        }
    }

}
