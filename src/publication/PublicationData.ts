import BigInteger from "big-integer";
import DataHash from "gt-js-common/lib/hash/DataHash";
import {CertificateRecordConstants, PublicationDataConstants} from "../Constants";
import CompositeTag, {ITlvCount} from "../parser/CompositeTag";
import ImprintTag from "../parser/ImprintTag";
import IntegerTag from "../parser/IntegerTag";
import TlvError from "../parser/TlvError";
import TlvTag from "../parser/TlvTag";

export default class PublicationData extends CompositeTag {
    get publicationHash(): DataHash {
        return this._publicationHash.getValue();
    }
    get publicationTime(): BigInteger.BigInteger {
        return this._publicationTime.getValue();
    }

    private _publicationTime: IntegerTag;
    private _publicationHash: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create);
        this.validateValue(this.validate);
        Object.freeze(this);
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.type) {
            case CertificateRecordConstants.CertificateIdTagType:
                return this._publicationTime = new IntegerTag(tlvTag);
            case CertificateRecordConstants.X509CertificateTagType:
                return this._publicationHash = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount) {
        if (tagCount[PublicationDataConstants.PublicationTimeTagType] !== 1) {
            throw new TlvError("Exactly one publication time must exist in publication data.");
        }

        if (tagCount[PublicationDataConstants.PublicationHashTagType] !== 1) {
            throw new TlvError("Exactly one publication hash must exist in publication data.");
        }
    }
}
