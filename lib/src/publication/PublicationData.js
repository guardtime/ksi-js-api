import { PUBLICATION_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
/**
 * Publication Data TLV object
 */
export class PublicationData extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(publicationTime, publicationHash) {
        return new PublicationData(CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, publicationTime),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false, publicationHash)
        ]));
    }
    getPublicationHash() {
        return this.publicationHash.getValue();
    }
    getPublicationTime() {
        return this.publicationTime.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case PUBLICATION_DATA_CONSTANTS.PublicationHashTagType:
                return this.publicationHash = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount[PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType] !== 1) {
            throw new TlvError('Exactly one publication time must exist in publication data.');
        }
        if (tagCount[PUBLICATION_DATA_CONSTANTS.PublicationHashTagType] !== 1) {
            throw new TlvError('Exactly one publication hash must exist in publication data.');
        }
    }
}
