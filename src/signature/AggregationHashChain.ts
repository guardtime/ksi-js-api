import {util} from 'node-forge';
import {AGGREGATION_HASH_CHAIN_CONSTANTS, LINK_DIRECTION_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {RawTag} from '../parser/RawTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Aggregation Hash Chain Link Metadata TLV Object
 */
class AggregationHashChainLinkMetaData extends CompositeTag {
    private padding: RawTag;
    private clientId: StringTag;
    private machineId: StringTag;
    private sequenceNumber: IntegerTag;
    private requestTime: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag, position: number): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.PaddingTagType:
                return this.padding = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType:
                return this.clientId = new StringTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType:
                return this.machineId = new StringTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType:
                return this.sequenceNumber = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType:
                return this.requestTime = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType] !== 1) {
            throw new TlvError('Exactly one client id must exist in aggregation hash chain link metadata.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType] > 1) {
            throw new TlvError('Only one machine id is allowed in aggregation hash chain link metadata.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType] > 1) {
            throw new TlvError('Only one sequence number is allowed in aggregation hash chain link metadata.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType] > 1) {
            throw new TlvError('Only one request time is allowed in aggregation hash chain link metadata.');
        }
    }
}

/**
 * Aggregation Hash Chain Link TLV Object
 */
class AggregationHashChainLink extends CompositeTag {
    private static readonly LEGACY_ID_FIRST_OCTET: number = 0x3;
    private static readonly LEGACY_ID_LENGTH: number = 29;

    private levelCorrection: IntegerTag;
    private siblingHash: ImprintTag;
    private legacyIdString: string;
    private metadata: AggregationHashChainLinkMetaData;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private static getLegacyIdString(bytes: Uint8Array): string {
        if (bytes.length === 0) {
            throw new TlvError('Invalid legacy id tag: empty');
        }

        if (bytes[0] !== AggregationHashChainLink.LEGACY_ID_FIRST_OCTET) {
            throw new TlvError(`Invalid first octet in legacy id tag: ${bytes[0]}`);
        }

        if (bytes[1] !== 0x0) {
            throw new TlvError(`Invalid second octet in legacy id tag: ${bytes[0]}`);
        }

        if (bytes.length !== AggregationHashChainLink.LEGACY_ID_LENGTH) {
            throw new TlvError(`Invalid legacy id tag length. Length: ${bytes.length}`);
        }

        const idStringLength: number = bytes[2];

        if (bytes.length < idStringLength + 4) {
            throw new TlvError(`Invalid legacy id length value: ${idStringLength}`);
        }

        for (let i: number = idStringLength + 3; i < bytes.length; i += 1) {
            if (bytes[i] !== 0x0) {
                throw new TlvError(`Invalid padding octet. Index: ${i}`);
            }
        }

        return util.text.utf8.decode(bytes.slice(3, idStringLength));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType:
                return this.levelCorrection = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType:
                return this.siblingHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId:
                const legacyIdTag: RawTag = new RawTag(tlvTag);
                // TODO: Make it better
                this.legacyIdString = AggregationHashChainLink.getLegacyIdString(legacyIdTag.getValue());

                return legacyIdTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType:
                return this.metadata = new AggregationHashChainLinkMetaData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType] > 1) {
            throw new TlvError('Only one LevelCorrection value is allowed in aggregation hash chain link.');
        }

        if (((tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType] || 0) +
             (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId] || 0) +
             (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType] || 0)) !== 1) {

            throw new TlvError('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
        }
    }
}

/**
 * Aggregation Hash Chain TLV Object
 */
export class AggregationHashChain extends CompositeTag {

    private chainIndexes: IntegerTag[] = [];
    private aggregationTime: IntegerTag;
    private chainLinks: AggregationHashChainLink[] = [];
    private aggregationAlgorithm: IntegerTag;
    private inputHash: ImprintTag;
    private inputData: RawTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType:
                const chainIndexTlvTag: IntegerTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTlvTag);

                return chainIndexTlvTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType:
                return this.inputData = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType:
                // TODO: Better solution
                return this.aggregationAlgorithm = new IntegerTag(tlvTag);
            case LINK_DIRECTION_CONSTANTS.Left:
            case LINK_DIRECTION_CONSTANTS.Right:
                const linkTag: AggregationHashChainLink = new AggregationHashChainLink(tlvTag);
                this.chainLinks.push(linkTag);

                return linkTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType] !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in aggregation hash chain.');
        }

        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain index is missing in aggregation hash chain.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType] > 1) {
            throw new TlvError('Only one input data value is allowed in aggregation hash chain.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType] !== 1) {
            throw new TlvError('Exactly one input hash must exist in aggregation hash chain.');
        }

        if (tagCount[AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType] !== 1) {
            throw new TlvError('Exactly one algorithm must exist in aggregation hash chain.');
        }

        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in aggregation hash chain.');
        }
    }
}
