import {DataHash, HashAlgorithm, HexCoder} from '@guardtime/gt-js-common';
import bigInteger from 'big-integer';

import {AGGREGATION_HASH_CHAIN_CONSTANTS, LinkDirection} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {ImprintTag} from '../../src/common/parser/ImprintTag';
import {IntegerTag} from '../../src/common/parser/IntegerTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {StringTag} from '../../src/common/parser/StringTag';
import {TlvTag} from '../../src/common/parser/TlvTag';
import {AggregationHashChain, AggregationHashChainLink} from '../../src/common/signature/AggregationHashChain';
import {IKsiIdentity} from '../../src/common/signature/IKsiIdentity';

/**
 * Aggregation hash chain TLV tag tests
 */
describe('AggregationHashChain', () => {
    it('Creation with TlvTag with optional content', async () => {
        const links: TlvTag[] = [
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ];

        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType, false, false, new Uint8Array([0x74, 0x65, 0x73, 0x74])),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            ...links
        ]);

        const chain: AggregationHashChain = new AggregationHashChain(tlvTag);

        expect(chain.getIdentity().map((identity: IKsiIdentity) => identity.getClientId())).toEqual(['test', 'me']);
        expect(chain.getChainIndex()).toEqual([bigInteger(1), bigInteger(2)]);
        expect(chain.getAggregationTime()).toEqual(bigInteger(1000));
        expect(JSON.stringify(chain.getChainLinks())).toEqual(
            JSON.stringify(links.map((tag: TlvTag) => new AggregationHashChainLink(tag))));
        expect(chain.getInputHash()).toEqual(
            DataHash.create(HashAlgorithm.SHA2_256, HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08')));
        expect(chain.getInputData()).toEqual(new Uint8Array([0x74, 0x65, 0x73, 0x74]));
        expect(await chain.getOutputHash({level: bigInteger(0), hash: chain.getInputHash()})).toEqual(
            {
                level: bigInteger(3),
                hash: DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array([
                    229, 50, 26, 124, 51, 134, 56, 23, 57, 55, 68, 237, 176, 74,
                    47, 141, 50, 205, 88, 1, 173, 136, 129, 101, 21, 18, 93, 17, 98, 87, 125, 75
                ]))
            }
        );
        expect(chain.getAggregationAlgorithm()).toEqual(HashAlgorithm.SHA2_256);
    });

    it('Creation with TlvTag', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        const chain: AggregationHashChain = new AggregationHashChain(tlvTag);

        expect(chain.getIdentity().map((identity: IKsiIdentity) => identity.getClientId())).toEqual(['test', 'me']);
        expect(chain.getChainIndex()).toEqual([bigInteger(1), bigInteger(2)]);
        expect(chain.getAggregationTime()).toEqual(bigInteger(1000));
        expect(chain.getChainLinks().map(
            (link: AggregationHashChainLink) =>
                link.getIdentity() === null ? null : (<IKsiIdentity>link.getIdentity()).getClientId()))
            .toEqual(['me', null, 'test']);
        expect(chain.getInputHash()).toEqual(
            DataHash.create(HashAlgorithm.SHA2_256, HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08')));
        expect(chain.getInputData()).toEqual(null);
        expect(await chain.getOutputHash({level: bigInteger(0), hash: chain.getInputHash()})).toEqual(
            {
                level: bigInteger(3),
                hash: DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array([
                    229, 50, 26, 124, 51, 134, 56, 23, 57, 55, 68, 237, 176, 74,
                    47, 141, 50, 205, 88, 1, 173, 136, 129, 101, 21, 18, 93, 17, 98, 87, 125, 75
                ]))
            }
        );
        expect(chain.getAggregationAlgorithm()).toEqual(HashAlgorithm.SHA2_256);
    });

    it('Creation with TlvTag missing aggregation time tag', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one aggregation time must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag multiple aggregation time tag', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1001)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one aggregation time must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag missing chain indexes', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Chain index is missing in aggregation hash chain.');
    });

    it('Creation with TlvTag containing multiple input data', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType, false, false, new Uint8Array([0x74, 0x65, 0x73, 0x74])),
            RawTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType, false, false, new Uint8Array([0x74, 0x65, 0x73, 0x74])),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Only one input data value is allowed in aggregation hash chain.');
    });

    it('Creation with TlvTag missing input hash', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one input hash must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag containing multiple input hash', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one input hash must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag missing aggregation algorithm', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one algorithm must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag containing multiple aggregation algorithm', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id)),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'me')
                ])
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType, false, false,
                                  DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)))
            ]),
            CompositeTag.CREATE_FROM_LIST(LinkDirection.Right, false, false, [
                CompositeTag.CREATE_FROM_LIST(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType, false, false, [
                    StringTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType, false, false, 'test')
                ])
            ])
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Exactly one algorithm must exist in aggregation hash chain.');
    });

    it('Creation with TlvTag missing chain links', async () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(LinkDirection.Left, false, false, [
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType, false, false, bigInteger(1000)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(1)),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType, false, false, bigInteger(2)),
            ImprintTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType, false, false,
                              DataHash.create(HashAlgorithm.SHA2_256,
                                              HexCoder.decode('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'))),
            IntegerTag.CREATE(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType, false, false,
                              bigInteger(HashAlgorithm.SHA2_256.id))
        ]);

        expect(() => {
            return new AggregationHashChain(tlvTag);
        }).toThrow('Links are missing in aggregation hash chain.');
    });

});
