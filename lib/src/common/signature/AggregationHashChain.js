var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var AggregationHashChainLinkMetaData = /** @class */ (function (_super) {
    __extends(AggregationHashChainLinkMetaData, _super);
    function AggregationHashChainLinkMetaData(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.padding = null;
        _this.machineId = null;
        _this.sequenceNumber = null;
        _this.requestTime = null;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    AggregationHashChainLinkMetaData.prototype.getClientId = function () {
        return this.clientId.getValue();
    };
    AggregationHashChainLinkMetaData.prototype.getMachineId = function () {
        return this.machineId === null ? null : this.machineId.getValue();
    };
    AggregationHashChainLinkMetaData.prototype.getSequenceNumber = function () {
        return this.sequenceNumber === null ? null : this.sequenceNumber.getValue();
    };
    AggregationHashChainLinkMetaData.prototype.getRequestTime = function () {
        return this.requestTime === null ? null : this.requestTime.getValue();
    };
    AggregationHashChainLinkMetaData.prototype.getPaddingTag = function () {
        return this.padding;
    };
    AggregationHashChainLinkMetaData.prototype.parseChild = function (tlvTag) {
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
    };
    AggregationHashChainLinkMetaData.prototype.validate = function (tagCount) {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.ClientIdTagType) !== 1) {
            throw new TlvError('Exactly one client id must exist in aggregation hash chain link metadata.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.MachineIdTagType) > 1) {
            throw new TlvError('Only one machine id is allowed in aggregation hash chain link metadata.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.SequenceNumberTagType) > 1) {
            throw new TlvError('Only one sequence number is allowed in aggregation hash chain link metadata.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.RequestTimeTagType) > 1) {
            throw new TlvError('Only one request time is allowed in aggregation hash chain link metadata.');
        }
    };
    return AggregationHashChainLinkMetaData;
}(CompositeTag));
export { AggregationHashChainLinkMetaData };
/**
 * Aggregation Hash Chain Link TLV Object
 */
var AggregationHashChainLink = /** @class */ (function (_super) {
    __extends(AggregationHashChainLink, _super);
    function AggregationHashChainLink(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.levelCorrection = null;
        _this.siblingHash = null;
        _this.legacyId = null;
        _this.metadata = null;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        switch (_this.id) {
            case LinkDirection.Left:
                _this.direction = LinkDirection.Left;
                break;
            case LinkDirection.Right:
                _this.direction = LinkDirection.Right;
                break;
            default:
                throw new TlvError('Invalid Link direction.');
        }
        Object.freeze(_this);
        return _this;
    }
    AggregationHashChainLink.getLegacyIdString = function (bytes) {
        if (bytes.length === 0) {
            throw new TlvError('Invalid legacy id tag: empty.');
        }
        if (bytes[0] !== AggregationHashChainLink.LEGACY_ID_FIRST_OCTET) {
            throw new TlvError("Invalid first octet in legacy id tag: 0x" + bytes[0].toString(16) + ".");
        }
        if (bytes[1] !== 0x0) {
            throw new TlvError("Invalid second octet in legacy id tag: 0x" + bytes[1].toString(16) + ".");
        }
        if (bytes.length !== AggregationHashChainLink.LEGACY_ID_LENGTH) {
            throw new TlvError("Invalid legacy id tag length. Length: " + bytes.length + ".");
        }
        var idStringLength = bytes[2];
        if (bytes.length <= idStringLength + 3) {
            throw new TlvError("Invalid legacy id length value: " + idStringLength + ".");
        }
        for (var i = idStringLength + 3; i < bytes.length; i += 1) {
            if (bytes[i] !== 0x0) {
                throw new TlvError("Invalid padding octet. Index: " + i + ".");
            }
        }
        return util.text.utf8.decode(bytes.slice(3, idStringLength + 3));
    };
    AggregationHashChainLink.prototype.getLevelCorrection = function () {
        return this.levelCorrection === null ? bigInteger(0) : this.levelCorrection.getValue();
    };
    AggregationHashChainLink.prototype.getMetadata = function () {
        return this.metadata;
    };
    AggregationHashChainLink.prototype.getDirection = function () {
        return this.direction;
    };
    AggregationHashChainLink.prototype.getSiblingData = function () {
        if (this.siblingHash !== null) {
            return this.siblingHash.getValue().imprint;
        }
        if (this.legacyId !== null) {
            return this.legacyId.getValue();
        }
        return this.metadata.getValueBytes();
    };
    AggregationHashChainLink.prototype.getIdentity = function () {
        if (this.legacyId !== null) {
            return new LegacyIdentity(this.legacyIdString);
        }
        return this.metadata;
    };
    AggregationHashChainLink.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType:
                return this.levelCorrection = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType:
                return this.siblingHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId:
                var legacyIdTag = new RawTag(tlvTag);
                this.legacyId = legacyIdTag;
                // TODO: Make it better
                this.legacyIdString = AggregationHashChainLink.getLegacyIdString(legacyIdTag.getValue());
                return legacyIdTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType:
                return this.metadata = new AggregationHashChainLinkMetaData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    AggregationHashChainLink.prototype.validate = function (tagCount) {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LevelCorrectionTagType) > 1) {
            throw new TlvError('Only one LevelCorrection value is allowed in aggregation hash chain link.');
        }
        if (((tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.SiblingHashTagType) || 0) +
            (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.LINK.LegacyId) || 0) +
            (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.METADATA.TagType) || 0)) !== 1) {
            throw new TlvError('Exactly one of three from sibling hash, legacy id or metadata must exist in aggregation hash chain link.');
        }
    };
    AggregationHashChainLink.LEGACY_ID_FIRST_OCTET = 0x3;
    AggregationHashChainLink.LEGACY_ID_LENGTH = 29;
    return AggregationHashChainLink;
}(CompositeTag));
export { AggregationHashChainLink };
/**
 * Aggregation Hash Chain TLV Object
 */
var AggregationHashChain = /** @class */ (function (_super) {
    __extends(AggregationHashChain, _super);
    function AggregationHashChain(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.chainIndexes = [];
        _this.chainLinks = [];
        _this.inputData = null;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    AggregationHashChain.prototype.getChainLinks = function () {
        return this.chainLinks;
    };
    /**
     * Get chain index values
     */
    AggregationHashChain.prototype.getChainIndex = function () {
        var result = [];
        for (var _i = 0, _a = this.chainIndexes; _i < _a.length; _i++) {
            var tag = _a[_i];
            result.push(tag.getValue());
        }
        return result;
    };
    AggregationHashChain.prototype.getAggregationTime = function () {
        return this.aggregationTime.getValue();
    };
    AggregationHashChain.prototype.getAggregationAlgorithm = function () {
        return this.aggregationAlgorithm;
    };
    AggregationHashChain.prototype.getIdentity = function () {
        var identity = [];
        for (var i = this.chainLinks.length - 1; i >= 0; i -= 1) {
            var linkIdentity = this.chainLinks[i].getIdentity();
            if (linkIdentity !== null) {
                identity.push(linkIdentity);
            }
        }
        return identity;
    };
    AggregationHashChain.prototype.getOutputHash = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var level, lastHash, _i, _a, link;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        level = result.level;
                        lastHash = result.hash;
                        _i = 0, _a = this.chainLinks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        link = _a[_i];
                        level = level.plus(link.getLevelCorrection().plus(1));
                        if (!(link.getDirection() === LinkDirection.Left)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getStepHash(lastHash.imprint, link.getSiblingData(), level)];
                    case 2:
                        lastHash = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!(link.getDirection() === LinkDirection.Right)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getStepHash(link.getSiblingData(), lastHash.imprint, level)];
                    case 4:
                        lastHash = _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, Object.freeze({ level: level, hash: lastHash })];
                }
            });
        });
    };
    AggregationHashChain.prototype.getInputHash = function () {
        return this.inputHash.getValue();
    };
    AggregationHashChain.prototype.getInputData = function () {
        return this.inputData === null ? null : this.inputData.getValue();
    };
    /**
     * Returns location pointer based on aggregation hash chain links
     */
    AggregationHashChain.prototype.calculateLocationPointer = function () {
        var result = bigInteger(0);
        var links = this.getChainLinks();
        for (var i = 0; i < this.getChainLinks().length; i += 1) {
            if (links[i].getDirection() === LinkDirection.Left) {
                result = result.or(bigInteger(1).shiftLeft(i));
            }
        }
        return result.or(bigInteger(1).shiftLeft(links.length));
    };
    AggregationHashChain.prototype.getStepHash = function (hashA, hashB, level) {
        return __awaiter(this, void 0, void 0, function () {
            var hasher;
            return __generator(this, function (_a) {
                hasher = new DataHasher(this.aggregationAlgorithm);
                hasher.update(hashA);
                hasher.update(hashB);
                hasher.update(UnsignedLongCoder.encode(level));
                return [2 /*return*/, hasher.digest()];
            });
        });
    };
    AggregationHashChain.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.ChainIndexTagType:
                var chainIndexTlvTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTlvTag);
                return chainIndexTlvTag;
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType:
                return this.inputData = new RawTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType:
                var algorithmTag = new IntegerTag(tlvTag);
                var algorithm = HashAlgorithm.getById(algorithmTag.getValue().valueOf());
                if (algorithm === null) {
                    throw new TlvError('Invalid algorithm: null');
                }
                this.aggregationAlgorithm = algorithm;
                return algorithmTag;
            case LinkDirection.Left:
            case LinkDirection.Right:
                var linkTag = new AggregationHashChainLink(tlvTag);
                this.chainLinks.push(linkTag);
                return linkTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    AggregationHashChain.prototype.validate = function (tagCount) {
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in aggregation hash chain.');
        }
        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain index is missing in aggregation hash chain.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputDataTagType) > 1) {
            throw new TlvError('Only one input data value is allowed in aggregation hash chain.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in aggregation hash chain.');
        }
        if (tagCount.getCount(AGGREGATION_HASH_CHAIN_CONSTANTS.AggregationAlgorithmIdTagType) !== 1) {
            throw new TlvError('Exactly one algorithm must exist in aggregation hash chain.');
        }
        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in aggregation hash chain.');
        }
    };
    return AggregationHashChain;
}(CompositeTag));
export { AggregationHashChain };
