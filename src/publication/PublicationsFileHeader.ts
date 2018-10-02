import {PublicationsFileHeaderConstants} from "../Constants";
import {ITlvCount} from "../parser/CompositeTag";
import CompositeTag from "../parser/CompositeTag";
import IntegerTag from "../parser/IntegerTag";
import StringTag from "../parser/StringTag";
import TlvError from "../parser/TlvError";
import TlvTag from "../parser/TlvTag";

export default class PublicationsFileHeader extends CompositeTag {

    private version: IntegerTag;
    private creationTime: IntegerTag;
    private repositoryUri: StringTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create);
        this.validateValue(this.validate);
        Object.freeze(this);
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.type) {
            case PublicationsFileHeaderConstants.VersionTagType:
                return this.version = new IntegerTag(tlvTag);
            case PublicationsFileHeaderConstants.CreationTimeTagType:
                return this.creationTime = new IntegerTag(tlvTag);
            case PublicationsFileHeaderConstants.RepositoryUriTagType:
                return this.repositoryUri = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount) {
        if (tagCount[PublicationsFileHeaderConstants.VersionTagType] !== 1) {
            throw new TlvError("Exactly one version must exist in publications file header.");
        }

        if (tagCount[PublicationsFileHeaderConstants.CreationTimeTagType] !== 1) {
            throw new TlvError("Exactly one creation time must exist in publications file header.");
        }

        if (tagCount[PublicationsFileHeaderConstants.RepositoryUriTagType] > 1) {
            throw new TlvError("Only one repository uri is allowed in publications file header.");
        }
    }
}
