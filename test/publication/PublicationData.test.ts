import bigInteger from 'big-integer';
import {DataHash, HashAlgorithm} from 'gt-js-common';

import {PUBLICATION_DATA_CONSTANTS} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {ImprintTag} from '../../src/common/parser/ImprintTag';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {TlvTag} from '../../src/common/parser/TlvTag';
import {PublicationData} from '../../src/common/publication/PublicationData';

/**
 * Certificate record TLV tag tests
 */
describe('PublicationData', () => {
    it('Creation with TlvTag', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        const publicationData: PublicationData = new PublicationData(tlvTag);
        expect(publicationData.getPublicationTime()).toEqual(bigInteger(2));
        expect(publicationData.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    });

    it('Creation with CREATE', () => {
        const publicationData: PublicationData = PublicationData.CREATE(bigInteger(2),
                                                                        DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
        expect(publicationData.getPublicationTime()).toEqual(bigInteger(2));
        expect(publicationData.getPublicationHash()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    });

    it('Creation with missing publication time', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        expect(() => {
            // @ts-ignore
            return new PublicationData(tlvTag);
        }).toThrow('Exactly one publication time must exist in publication data.');
    });

    it('Creation with missing publication hash', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2))
        ]);

        expect(() => {
            // @ts-ignore
            return new PublicationData(tlvTag);
        }).toThrow('Exactly one publication hash must exist in publication data.');
    });

    it('Creation with multiple publication time', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        expect(() => {
            // @ts-ignore
            return new PublicationData(tlvTag);
        }).toThrow('Exactly one publication time must exist in publication data.');
    });

    it('Creation with multiple publication hash', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(PUBLICATION_DATA_CONSTANTS.TagType, false, false, [
            IntegerTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationTimeTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
            ImprintTag.CREATE(PUBLICATION_DATA_CONSTANTS.PublicationHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        expect(() => {
            // @ts-ignore
            return new PublicationData(tlvTag);
        }).toThrow('Exactly one publication hash must exist in publication data.');
    });
});
