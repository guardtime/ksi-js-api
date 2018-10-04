import BigInteger from 'node_modules/big-integer/BigInteger';
import DataHash from 'node_modules/gt-js-common/lib/hash/DataHash';
import {PUBLICATION_DATA_CONSTANTS, PUBLICATION_RECORD_CONSTANTS} from 'src/Constants';
import {CompositeTag, ITlvCount} from 'src/parser/CompositeTag';
import {StringTag} from 'src/parser/StringTag';
import {TlvError} from 'src/parser/TlvError';
import {TlvTag} from 'src/parser/TlvTag';
import {PublicationData} from 'src/publication/PublicationData';

/**
 * Publication Record TLV object
 */
export class PublicationRecord extends CompositeTag {

    public publicationData: PublicationData;
    private publicationReferences: StringTag[];
    private repositoryUri: StringTag[];

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getPublicationHash(): DataHash {
        return this.publicationData.getPublicationHash();
    }
    public getPublicationTime(): BigInteger.BigInteger {
        return this.publicationData.getPublicationTime();
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case PUBLICATION_RECORD_CONSTANTS.PublicationReferencesTagType:
                const reference: StringTag = new StringTag(tlvTag);
                this.publicationReferences.push(reference);

                return reference;
            case PUBLICATION_RECORD_CONSTANTS.PublicationRepositoryUriTagType:
                const uri: StringTag = new StringTag(tlvTag);
                this.repositoryUri.push(uri);

                return uri;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PUBLICATION_DATA_CONSTANTS.TagType] !== 1) {
            throw new TlvError('Exactly one publication data must exist in publication record.');
        }
    }

}
