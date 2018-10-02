import BigInteger from "big-integer";
import DataHash from "gt-js-common/lib/hash/DataHash";
import {PublicationDataConstants, PublicationRecordConstants} from "../Constants";
import CompositeTag, {ITlvCount} from "../parser/CompositeTag";
import StringTag from "../parser/StringTag";
import TlvError from "../parser/TlvError";
import TlvTag from "../parser/TlvTag";
import PublicationData from "./PublicationData";

export default class PublicationRecord extends CompositeTag {

    get publicationHash(): DataHash {
        return this.publicationData.publicationHash;
    }
    get publicationTime(): BigInteger.BigInteger {
        return this.publicationData.publicationTime;
    }

    public publicationData: PublicationData;
    private publicationReferences: StringTag[];
    private repositoryUri: StringTag[];

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create);
        this.validateValue(this.validate);

        Object.freeze(this);
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.type) {
            case PublicationDataConstants.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case PublicationRecordConstants.PublicationReferencesTagType:
                const reference = new StringTag(tlvTag);
                this.publicationReferences.push(reference);
                return reference;
            case PublicationRecordConstants.PublicationRepositoryUriTagType:
                const uri = new StringTag(tlvTag);
                this.repositoryUri.push(uri);
                return uri;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount) {
        if (tagCount[PublicationDataConstants.TagType] !== 1) {
            throw new TlvError("Exactly one publication data must exist in publication record.");
        }
    }

}
