import {SIGNATURE_DATA_CONSTANTS} from '../Constants';
import {CompositeTag, ICount} from '../parser/CompositeTag';
import {RawTag} from '../parser/RawTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Signature data TLV Object
 */
export class SignatureData extends CompositeTag {

    private certificateId: RawTag;
    private certificateRepositoryUri: StringTag;
    private signatureType: StringTag;
    private signatureValue: RawTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getSignatureType(): string {
        return this.signatureType.getValue();
    }

    public getCertificateId(): Uint8Array {
        return this.certificateId.getValue();
    }

    public getSignatureValue(): Uint8Array {
        return this.signatureValue.getValue();
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
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

    // noinspection JSMethodCanBeStatic
    private validate(tagCount: ICount): void {
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType) !== 1) {
            throw new TlvError('Exactly one signature type must exist in signature data.');
        }

        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType) !== 1) {
            throw new TlvError('Exactly one signature value must exist in signature data.');
        }

        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType) !== 1) {
            throw new TlvError('Exactly one certificate id must exist in signature data.');
        }

        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType) > 1) {
            throw new TlvError('Only one certificate repository uri is allowed in signature data.');
        }
    }
}
