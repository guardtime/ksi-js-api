import bigInteger, {BigInteger} from 'big-integer';
import {DataHash} from 'gt-js-common';
import {PUBLICATION_DATA_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import Base32Coder from 'gt-js-common/lib/coders/Base32Coder';
import CRC32 from 'gt-js-common/lib/crc/CRC32';
import UnsignedLongCoder from 'gt-js-common/lib/coders/UnsignedLongCoder';

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

    public static CREATE(publicationTime: BigInteger, publicationHash: DataHash): PublicationData {
        return new PublicationData(CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, publicationTime),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false, publicationHash)
        ]));
    }

    public static CREATE_FROM_PUBLICATION_STRING(publicationString: string): PublicationData {
        const bytesWithCrc32: Uint8Array = Base32Coder.decode(publicationString);

        // Length needs to be at least 13 bytes (8 bytes for time plus non-empty hash imprint plus 4 bytes for crc32)
        if (bytesWithCrc32.length < 13) {
            throw new TlvError('Publication string base 32 decode failed.');
        }

        if (JSON.stringify(CRC32.create(bytesWithCrc32.slice(0, -4))) !== JSON.stringify(bytesWithCrc32.slice(-4))) {
            throw new TlvError('Publication string CRC 32 check failed.');
        }

        return PublicationData.CREATE(
            UnsignedLongCoder.decode(bytesWithCrc32, 0, bytesWithCrc32.length - 12),
            new DataHash(bytesWithCrc32.slice(0, 8))
        );
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
