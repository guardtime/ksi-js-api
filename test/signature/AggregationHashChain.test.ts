import bigInteger from 'big-integer';

import {AGGREGATION_HASH_CHAIN_CONSTANTS} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {StringTag} from '../../src/common/parser/StringTag';
import {TlvTag} from '../../src/common/parser/TlvTag';
import {AggregationHashChainLinkMetaData} from '../../src/common/signature/AggregationHashChain';
import {ImprintTag} from '../../src/common/parser/ImprintTag';
import HashAlgorithm from 'gt-js-common/lib/hash/HashAlgorithm';
import DataHash from 'gt-js-common/lib/hash/DataHash';

/**
 * Aggregation hash chain link metadata TLV tag tests
 */
describe('AggregationHashChainLinkMetaData', () => {
    it('Creation with TlvTag', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingTagType,
                false,
                false,
                AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000))
        ]);

        const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
        expect(metaData.getClientId()).toEqual('test_client');
        expect(metaData.getMachineId()).toEqual('test_machine');
        expect(metaData.getSequenceNumber()).toEqual(bigInteger(0));
        expect(metaData.getRequestTime()).toEqual(bigInteger(1000));
        expect((<RawTag>metaData.getPaddingTag()).getValue()).toEqual(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd);
    });

    it('Creation with only client Id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
        ]);

        const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
        expect(metaData.getClientId()).toEqual('test_client');
        expect(metaData.getMachineId()).toEqual(null);
        expect(metaData.getSequenceNumber()).toEqual(null);
        expect(metaData.getRequestTime()).toEqual(null);
        expect(metaData.getPaddingTag()).toEqual(null);
    });

    it('Creation with missing client id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
    });

    it('Creation with multiple client id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client1')
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
    });

    it('Creation with multiple machine id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine1')
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one machine id is allowed in aggregation hash chain link metadata.');
    });

    it('Creation with multiple sequence number', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(1))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one sequence number is allowed in aggregation hash chain link metadata.');
    });

    it('Creation with multiple request time', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one request time is allowed in aggregation hash chain link metadata.');
    });
});

/**
 * Aggregation hash chain link metadata TLV tag tests
 */
describe('AggregationHashChainLink', () => {
    it('Creation with TlvTag', () => {

        const legacyId: Uint8Array = new Uint8Array(29);
        legacyId.set([0x3]);

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(0x7, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType, false, false, bigInteger(0)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32))),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId, false, false, legacyId),
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
            ])
        ]);

        const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
        expect(metaData.getClientId()).toEqual('test_client');
        expect(metaData.getMachineId()).toEqual('test_machine');
        expect(metaData.getSequenceNumber()).toEqual(bigInteger(0));
        expect(metaData.getRequestTime()).toEqual(bigInteger(1000));
        expect((<RawTag>metaData.getPaddingTag()).getValue()).toEqual(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingKnownValueOdd);
    });

    it('Creation with only client Id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client')
        ]);

        const metaData: AggregationHashChainLinkMetaData = new AggregationHashChainLinkMetaData(tlvTag);
        expect(metaData.getClientId()).toEqual('test_client');
        expect(metaData.getMachineId()).toEqual(null);
        expect(metaData.getSequenceNumber()).toEqual(null);
        expect(metaData.getRequestTime()).toEqual(null);
        expect(metaData.getPaddingTag()).toEqual(null);
    });

    it('Creation with missing client id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
    });

    it('Creation with multiple client id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client1')
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Exactly one client id must exist in aggregation hash chain link metadata.');
    });

    it('Creation with multiple machine id', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine1')
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one machine id is allowed in aggregation hash chain link metadata.');
    });

    it('Creation with multiple sequence number', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(1))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one sequence number is allowed in aggregation hash chain link metadata.');
    });

    it('Creation with multiple request time', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test_client'),
            StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType, false, false, 'test_machine'),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType, false, false, bigInteger(0)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType, false, false, bigInteger(1))
        ]);

        expect(() => {
            // @ts-ignore
            return new AggregationHashChainLinkMetaData(tlvTag);
        }).toThrow('Only one request time is allowed in aggregation hash chain link metadata.');
    });
});
