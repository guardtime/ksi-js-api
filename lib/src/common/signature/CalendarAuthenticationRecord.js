import { PUBLICATION_DATA_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { PublicationData } from '../publication/PublicationData';
import { SignatureData } from './SignatureData';
/**
 * Calendar Authentication Record TLV Object
 */
export class CalendarAuthenticationRecord extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getPublicationData() {
        return this.publicationData;
    }
    getSignatureData() {
        return this.signatureData;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.TagType:
                return this.signatureData = new SignatureData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one publication data must exist in calendar authentication record.');
        }
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one signature data must exist in calendar authentication record.');
        }
    }
}
