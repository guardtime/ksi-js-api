import { PUBLICATIONS_FILE_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
/**
 * Publications File Header TLV Object
 */
export class PublicationsFileHeader extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.repositoryUri = null;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getVersion() {
        return this.version.getValue();
    }
    getCreationTime() {
        return this.creationTime.getValue();
    }
    getRepositoryUri() {
        return this.repositoryUri === null ? null : this.repositoryUri.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType:
                return this.version = new IntegerTag(tlvTag);
            case PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType:
                return this.creationTime = new IntegerTag(tlvTag);
            case PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType:
                return this.repositoryUri = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType) !== 1) {
            throw new TlvError('Exactly one version must exist in publications file header.');
        }
        if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType) !== 1) {
            throw new TlvError('Exactly one creation time must exist in publications file header.');
        }
        if (tagCount.getCount(PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType) > 1) {
            throw new TlvError('Only one repository uri is allowed in publications file header.');
        }
    }
}
