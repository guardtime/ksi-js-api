import BigInteger from 'node_modules/big-integer/BigInteger';
import DataHash from 'node_modules/gt-js-common/lib/hash/DataHash';
import {CERTIFICATE_RECORD_CONSTANTS, PUBLICATION_DATA_CONSTANTS} from 'src/Constants';
import {CompositeTag, ITlvCount} from 'src/parser/CompositeTag';
import {ImprintTag} from 'src/parser/ImprintTag';
import {IntegerTag} from 'src/parser/IntegerTag';
import {TlvError} from 'src/parser/TlvError';
import {TlvTag} from 'src/parser/TlvTag';

/**
 * Publication Data TLV object
 */
export class PublicationData extends CompositeTag {

    private publicationTime: IntegerTag;
    private publicationHash: ImprintTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.create.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    public getPublicationHash(): DataHash {
        return this.publicationHash.getValue();
    }
    public getPublicationTime(): BigInteger.BigInteger {
        return this.publicationTime.getValue();
    }

    private create(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType:
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
