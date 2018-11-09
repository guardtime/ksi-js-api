import bigInteger from 'big-integer';
import {DataHash, HashAlgorithm} from 'gt-js-common';

import {AGGREGATION_HASH_CHAIN_CONSTANTS, LinkDirection} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {ImprintTag} from '../../src/common/parser/ImprintTag';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {StringTag} from '../../src/common/parser/StringTag';
import {TlvTag} from '../../src/common/parser/TlvTag';
import {AggregationHashChainLink, AggregationHashChainLinkMetaData} from '../../src/common/signature/AggregationHashChain';
import {LegacyIdentity} from '../../src/common/signature/LegacyIdentity';

/**
 * Aggregation hash chain link TLV tag tests
 */
describe('AggregationHashChainLink', () => {
    it('Creation with TlvTag containing only sibling hash', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        const link: AggregationHashChainLink = new AggregationHashChainLink(tlvTag);
        expect(link.getLevelCorrection()).toEqual(bigInteger(1));
        expect(link.getDirection()).toEqual(LinkDirection.Left);
        expect(link.getSiblingData()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)).imprint);
        expect(link.getIdentity()).toEqual(null);
        expect(link.getMetadata()).toEqual(null);
    });

    it('Creation with TlvTag containing only legacy id', () => {

        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        const link: AggregationHashChainLink = new AggregationHashChainLink(tlvTag);
        expect(link.getLevelCorrection()).toEqual(bigInteger(1));
        expect(link.getDirection()).toEqual(LinkDirection.Left);
        expect(link.getSiblingData()).toEqual(legacyId);
        expect(link.getIdentity()).toEqual(new LegacyIdentity('test'));
        expect(link.getMetadata()).toEqual(null);
    });

    it('Creation with TlvTag containing only metadata', () => {
        const metadata: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
        ]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            metadata
        ]);

        const link: AggregationHashChainLink = new AggregationHashChainLink(tlvTag);
        expect(link.getLevelCorrection()).toEqual(bigInteger(1));
        expect(link.getDirection()).toEqual(LinkDirection.Left);
        expect(link.getSiblingData()).toEqual(new Uint8Array([1, 12, 116, 101, 115, 116, 95, 99, 108, 105, 101, 110, 116, 0]));
        expect((<AggregationHashChainLinkMetaData>link.getIdentity()).equals(new AggregationHashChainLinkMetaData(metadata))).toBeTruthy();
        expect((<AggregationHashChainLinkMetaData>link.getMetadata()).equals(new AggregationHashChainLinkMetaData(metadata))).toBeTruthy();
    });

    it('Creation with TlvTag with invalid link direction', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(0x1, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ])
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid Link direction.');
    });

    it('Creation with TlvTag containing sibling hash and legacy id', () => {

        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing siblinghash and metadata', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ])
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing legacy id and metadata', () => {

        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ])
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing multiple sibling hash', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing multiple legacy id', () => {
        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing multiple metadata', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ]),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ])
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing multiple level correction', () => {

        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Only one LevelCorrection value is allowed in aggregation hash chain link.');
    });

    it('Creation with TlvTag containing only level correction', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1))
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
    });

    it('Creation with TlvTag with legacy id missing content', () => {
        const legacyId: Uint8Array = new Uint8Array(0);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid legacy id tag: empty.');
    });

    it('Creation with TlvTag with legacy id invalid first octet', () => {
        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x4, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid first octet in legacy id tag: 0x4.');
    });

    it('Creation with TlvTag with legacy id invalid second octet', () => {
        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x1, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid second octet in legacy id tag: 0x1.');
    });

    it('Creation with TlvTag with legacy id invalid length', () => {
        const legacyId: Uint8Array = new Uint8Array(30);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid legacy id tag length. Length: 30.');
    });

    it('Creation with TlvTag with legacy id invalid string length', () => {
        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x1A, 0x74, 0x65, 0x73, 0x74]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid legacy id length value: 26.');
    });

    it('Creation with TlvTag with legacy id invalid octet after string', () => {
        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3, 0x0, 0x4, 0x74, 0x65, 0x73, 0x74, 0x0, 0x1]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(1)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId)
        ]);

        expect(() => {
            return new AggregationHashChainLink(tlvTag);
        }).toThrow('Invalid padding octet. Index: 8.');
    });
});
