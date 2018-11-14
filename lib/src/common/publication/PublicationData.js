import { DataHash } from 'gt-js-common';
import Base32Coder from 'gt-js-common/lib/coders/Base32Coder';
import UnsignedLongCoder from 'gt-js-common/lib/coders/UnsignedLongCoder';
import CRC32 from 'gt-js-common/lib/crc/CRC32';
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
    static CREATE_FROM_PUBLICATION_STRING(publicationString) {
        const bytesWithCrc32 = Base32Coder.decode(publicationString);
        // Length needs to be at least 13 bytes (8 bytes for time plus non-empty hash imprint plus 4 bytes for crc32)
        if (bytesWithCrc32.length < 13) {
            throw new TlvError('Publication string base 32 decode failed.');
        }
        console.log('TEST', bytesWithCrc32.slice(0, -4), bytesWithCrc32.slice(-4), CRC32.create(bytesWithCrc32.slice(0, -4)));
        if (JSON.stringify(CRC32.create(bytesWithCrc32.slice(0, -4))) !== JSON.stringify(bytesWithCrc32.slice(-4))) {
            throw new TlvError('Publication string CRC 32 check failed.');
        }
        return PublicationData.CREATE(UnsignedLongCoder.decode(bytesWithCrc32, 0, bytesWithCrc32.length - 12), new DataHash(bytesWithCrc32.slice(0, 8)));
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
