import {PUBLICATION_DATA_CONSTANTS, SIGNATURE_DATA_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PublicationData} from '../publication/PublicationData';
import {SignatureData} from './SignatureData';

/**
 * Calendar Authentication Record TLV Object
 */
export class CalendarAuthenticationRecord extends CompositeTag {
    private publicationData: PublicationData;
    private signatureData: SignatureData;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getPublicationData(): PublicationData {
        return this.publicationData;
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.TagType:
                return this.signatureData = new SignatureData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PUBLICATION_DATA_CONSTANTS.TagType] !== 1) {
            throw new TlvError('Exactly one publication data must exist in calendar authentication record.');
        }

        if (tagCount[SIGNATURE_DATA_CONSTANTS.TagType] !== 1) {
            throw new TlvError('Exactly one signature data must exist in calendar authentication record.');
        }
    }
}
