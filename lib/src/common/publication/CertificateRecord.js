import { CERTIFICATE_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { TlvError } from '../parser/TlvError';
/**
 * Certificate Record TLV object
 */
export class CertificateRecord extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getX509Certificate() {
        return this.x509Certificate.getValue();
    }
    getCertificateId() {
        return this.certificateId.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
                return this.certificateId = new RawTag(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType:
                return this.x509Certificate = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType) !== 1) {
            throw new TlvError('Exactly one certificate id must exist in certificate record.');
        }
        if (tagCount.getCount(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType) !== 1) {
            throw new TlvError('Exactly one certificate must exist in certificate record.');
        }
    }
}
