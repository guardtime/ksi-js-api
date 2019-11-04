import { Base32Coder, CRC32, DataHash, UnsignedLongCoder } from '@guardtime/gt-js-common';
import { PUBLICATION_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { compareTypedArray } from '../util/Array';
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
    static CREATE_FROM_PUBLICATION_STRING(publicationString) {
        const bytesWithCrc32 = Base32Coder.decode(publicationString);
        // Length needs to be at least 13 bytes (8 bytes for time plus non-empty hash imprint plus 4 bytes for crc32)
        if (bytesWithCrc32.length < 13) {
            throw new TlvError('Publication string base 32 decode failed.');
        }
        const calculatedCrc32 = UnsignedLongCoder.encode(CRC32.create(bytesWithCrc32.slice(0, -4)));
        const messageCrc32 = bytesWithCrc32.slice(-4);
        if (!compareTypedArray(calculatedCrc32, messageCrc32)) {
            // tslint:disable-next-line:max-line-length
            throw new TlvError(`Publication string CRC 32 check failed. Calculated: ${JSON.stringify(calculatedCrc32)}; From Message: ${JSON.stringify(messageCrc32)}`);
        }
        return PublicationData.CREATE(UnsignedLongCoder.decode(bytesWithCrc32, 0, 8), new DataHash(bytesWithCrc32.slice(8, -4)));
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
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType) !== 1) {
            throw new TlvError('Exactly one publication time must exist in publication data.');
        }
        if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType) !== 1) {
            throw new TlvError('Exactly one publication hash must exist in publication data.');
        }
    }
}
