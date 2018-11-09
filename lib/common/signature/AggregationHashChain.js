var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bigInteger from 'big-integer';
import { DataHasher, HashAlgorithm, UnsignedLongCoder } from 'gt-js-common';
import { util } from 'node-forge';
import { AGGREGATION_HASH_CHAIN_CONSTANTS, LinkDirection } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { RawTag } from '../parser/RawTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { LegacyIdentity } from './LegacyIdentity';
/**
 * Aggregation Hash Chain Link Metadata TLV Object
 */
export class AggregationHashChainLinkMetaData extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.padding = null;
        this.machineId = null;
        this.sequenceNumber = null;
        this.requestTime = null;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getClientId() {
        return this.clientId.getValue();
    }
    getMachineId() {
        return this.machineId === null ? null : this.machineId.getValue();
    }
    getSequenceNumber() {
        return this.sequenceNumber === null ? null : this.sequenceNumber.getValue();
    }
    getRequestTime() {
        return this.requestTime === null ? null : this.requestTime.getValue();
    }
    getPaddingTag() {
        return this.padding;
    }
    parseChild(tlvTag) {
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
    validate(tagCount) {
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
export class AggregationHashChainLink extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.levelCorrection = null;
        this.siblingHash = null;
        this.legacyId = null;
        this.metadata = null;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        switch (this.id) {
            case LinkDirection.Left:
                this.direction = LinkDirection.Left;
                break;
            case LinkDirection.Right:
                this.direction = LinkDirection.Right;
                break;
            default:
                throw new TlvError('Invalid Link direction.');
        }
        Object.freeze(this);
    }
    static getLegacyIdString(bytes) {
        if (bytes.length === 0) {
            throw new TlvError('Invalid legacy id tag: empty.');
        }
        if (bytes[0] !== AggregationHashChainLink.LEGACY_ID_FIRST_OCTET) {
            throw new TlvError(`Invalid first octet in legacy id tag: 0x${bytes[0].toString(16)}.`);
        }
        if (bytes[1] !== 0x0) {
            throw new TlvError(`Invalid second octet in legacy id tag: 0x${bytes[1].toString(16)}.`);
        }
        if (bytes.length !== AggregationHashChainLink.LEGACY_ID_LENGTH) {
            throw new TlvError(`Invalid legacy id tag length. Length: ${bytes.length}.`);
        }
        const idStringLength = bytes[2];
        if (bytes.length <= idStringLength + 3) {
            throw new TlvError(`Invalid legacy id length value: ${idStringLength}.`);
        }
        for (let i = idStringLength + 3; i < bytes.length; i += 1) {
            if (bytes[i] !== 0x0) {
                throw new TlvError(`Invalid padding octet. Index: ${i}.`);
            }
        }
        return util.text.utf8.decode(bytes.slice(3, idStringLength + 3));
    }
    getLevelCorrection() {
        return this.levelCorrection === null ? bigInteger(0) : this.levelCorrection.getValue();
    }
    getMetadata() {
        return this.metadata;
    }
    getDirection() {
        return this.direction;
    }
    getSiblingData() {
        if (this.siblingHash !== null) {
            return this.siblingHash.getValue().imprint;
        }
        if (this.legacyId !== null) {
            return this.legacyId.getValue();
        }
        return this.metadata.getValueBytes();
    }
    getIdentity() {
        if (this.legacyId !== null) {
            return new LegacyIdentity(this.legacyIdString);
        }
        return this.metadata;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType:
                return this.levelCorrection = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType:
                return this.siblingHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId:
                const legacyIdTag = new RawTag(tlvTag);
                this.legacyId = legacyIdTag;
                // TODO: Make it better
                this.legacyIdString = AggregationHashChainLink.getLegacyIdString(legacyIdTag.getValue());
                return legacyIdTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType:
                return this.metadata = new AggregationHashChainLinkMetaData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
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
AggregationHashChainLink.LEGACY_ID_FIRST_OCTET = 0x3;
AggregationHashChainLink.LEGACY_ID_LENGTH = 29;
/**
 * Aggregation Hash Chain TLV Object
 */
export class AggregationHashChain extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.chainIndexes = [];
        this.chainLinks = [];
        this.inputData = null;
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getChainLinks() {
        return this.chainLinks;
    }
    /**
     * Get chain index values
     */
    getChainIndex() {
        const result = [];
        for (const tag of this.chainIndexes) {
            result.push(tag.getValue());
        }
        return result;
    }
    getAggregationTime() {
        return this.aggregationTime.getValue();
    }
    getAggregationAlgorithm() {
        return this.aggregationAlgorithm;
    }
    getIdentity() {
        const identity = [];
        for (let i = this.chainLinks.length - 1; i >= 0; i -= 1) {
            const linkIdentity = this.chainLinks[i].getIdentity();
            if (linkIdentity !== null) {
                identity.push(linkIdentity);
            }
        }
        return identity;
    }
    getOutputHash(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let level = result.level;
            let lastHash = result.hash;
            for (const link of this.chainLinks) {
                level = level.plus(link.getLevelCorrection().plus(1));
                if (link.getDirection() === LinkDirection.Left) {
                    lastHash = yield this.getStepHash(lastHash.imprint, link.getSiblingData(), level);
                }
                if (link.getDirection() === LinkDirection.Right) {
                    lastHash = yield this.getStepHash(link.getSiblingData(), lastHash.imprint, level);
                }
            }
            return Object.freeze({ level: level, hash: lastHash });
        });
    }
    getInputHash() {
        return this.inputHash.getValue();
    }
    getInputData() {
        return this.inputData === null ? null : this.inputData.getValue();
    }
    /**
     * Returns location pointer based on aggregation hash chain links
     */
    calculateLocationPointer() {
        let result = bigInteger(0);
        const links = this.getChainLinks();
        for (let i = 0; i < this.getChainLinks().length; i += 1) {
            if (links[i].getDirection() === LinkDirection.Left) {
                result = result.or(bigInteger(1).shiftLeft(i));
            }
        }
        return result.or(bigInteger(1).shiftLeft(links.length));
    }
    getStepHash(hashA, hashB, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasher = new DataHasher(this.aggregationAlgorithm);
            hasher.update(hashA);
            hasher.update(hashB);
            hasher.update(UnsignedLongCoder.encode(level));
            return hasher.digest();
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType:
                const chainIndexTlvTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTlvTag);
                return chainIndexTlvTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType:
                return this.inputData = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType:
                const algorithmTag = new IntegerTag(tlvTag);
                const algorithm = HashAlgorithm.getById(algorithmTag.getValue().valueOf());
                if (algorithm === null) {
                    throw new TlvError('Invalid algorithm: null');
                }
                this.aggregationAlgorithm = algorithm;
                return algorithmTag;
            case LinkDirection.Left:
            case LinkDirection.Right:
                const linkTag = new AggregationHashChainLink(tlvTag);
                this.chainLinks.push(linkTag);
                return linkTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
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
