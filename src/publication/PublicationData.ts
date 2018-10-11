import bigInteger from 'big-integer';
import {DataHash} from 'gt-js-common';
import {CERTIFICATE_RECORD_CONSTANTS, PUBLICATION_DATA_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Publication Data TLV object
 */
export class PublicationData extends CompositeTag {

    private publicationTime: IntegerTag;
    private publicationHash: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    public getPublicationHash(): DataHash {
        return this.publicationHash.getValue();
    }
    public getPublicationTime(): bigInteger.BigInteger {
        return this.publicationTime.getValue();
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case PUBLICATION_DATA_CONSTANTS.PublicationHashTagType:
                return this.publicationHash = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType] !== 1) {
            throw new TlvError('Exactly one publication time must exist in publication data.');
        }

        if (tagCount[PUBLICATION_DATA_CONSTANTS.PublicationHashTagType] !== 1) {
            throw new TlvError('Exactly one publication hash must exist in publication data.');
        }
    }
}
