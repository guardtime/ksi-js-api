import {PUBLICATIONS_FILE_HEADER_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Publications File Header TLV Object
 */
export class PublicationsFileHeader extends CompositeTag {

    private version: IntegerTag;
    private creationTime: IntegerTag;
    private repositoryUri: StringTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
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

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PUBLICATIONS_FILE_HEADER_CONSTANTS.VersionTagType] !== 1) {
            throw new TlvError('Exactly one version must exist in publications file header.');
        }

        if (tagCount[PUBLICATIONS_FILE_HEADER_CONSTANTS.CreationTimeTagType] !== 1) {
            throw new TlvError('Exactly one creation time must exist in publications file header.');
        }

        if (tagCount[PUBLICATIONS_FILE_HEADER_CONSTANTS.RepositoryUriTagType] > 1) {
            throw new TlvError('Only one repository uri is allowed in publications file header.');
        }
    }
}
