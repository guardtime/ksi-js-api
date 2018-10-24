import { SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
/**
 * Signature data TLV Object
 */
export class SignatureData extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getCertificateId() {
        return this.certificateId.getValue();
    }
    getSignatureValue() {
        return this.signatureValue.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType:
                return this.signatureType = new StringTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.SignatureValueTagType:
                return this.signatureValue = new RawTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.CertificateIdTagType:
                return this.certificateId = new RawTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType:
                return this.certificateRepositoryUri = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount[SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType] !== 1) {
            throw new TlvError('Exactly one signature type must exist in signature data.');
        }
        if (tagCount[SIGNATURE_DATA_CONSTANTS.SignatureValueTagType] !== 1) {
            throw new TlvError('Exactly one signature value must exist in signature data.');
        }
        if (tagCount[SIGNATURE_DATA_CONSTANTS.CertificateIdTagType] !== 1) {
            throw new TlvError('Exactly one certificate id must exist in signature data.');
        }
        if (tagCount[SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType] > 1) {
            throw new TlvError('Only one certificate repository uri is allowed in signature data.');
        }
    }
}
