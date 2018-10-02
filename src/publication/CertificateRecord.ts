import {CertificateRecordConstants} from "../Constants";
import CompositeTag, {ITlvCount} from "../parser/CompositeTag";
import RawTag from "../parser/RawTag";
import TlvError from "../parser/TlvError";
import TlvTag from "../parser/TlvTag";

export default class CertificateRecord extends CompositeTag {
    get x509Certificate(): Uint8Array {
        return this._x509Certificate.getValue();
    }

    get certificateId(): Uint8Array {
        return this._certificateId.getValue();
    }

    private _certificateId: RawTag;
    private _x509Certificate: RawTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create);
        this.validateValue(this.validate);

        Object.freeze(this);
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.type) {
            case CertificateRecordConstants.CertificateIdTagType:
                return this._certificateId = new RawTag(tlvTag);
            case CertificateRecordConstants.X509CertificateTagType:
                return this._x509Certificate = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount) {
        if (tagCount[CertificateRecordConstants.CertificateIdTagType] !== 1) {
            throw new TlvError("Certificate Id is missing.");
        }

        if (tagCount[CertificateRecordConstants.X509CertificateTagType] !== 1) {
            throw new TlvError("Exactly one certificate must exist in certificate record.");
        }
    }

}
