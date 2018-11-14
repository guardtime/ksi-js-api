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
import { DataHasher, HashAlgorithm } from 'gt-js-common';
import { RFC_3161_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { RawTag } from '../parser/RawTag';
import { TlvError } from '../parser/TlvError';
/**
 * RFC 3161 Record TLV Object
 */
var Rfc3161Record = /** @class */ (function (_super) {
    __extends(Rfc3161Record, _super);
    function Rfc3161Record(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.chainIndexes = [];
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    Rfc3161Record.prototype.getInputHash = function () {
        return this.inputHash.getValue();
    };
    Rfc3161Record.prototype.getTstInfoAlgorithm = function () {
        return this.tstInfoAlgorithm;
    };
    Rfc3161Record.prototype.getSignedAttributesAlgorithm = function () {
        return this.signedAttributesAlgorithm;
    };
    Rfc3161Record.prototype.getAggregationTime = function () {
        return this.aggregationTime.getValue();
    };
    /**
     * Get chain index values
     */
    Rfc3161Record.prototype.getChainIndex = function () {
        var result = [];
        for (var _i = 0, _a = this.chainIndexes; _i < _a.length; _i++) {
            var tag = _a[_i];
            result.push(tag.getValue());
        }
        return result;
    };
    Rfc3161Record.prototype.getOutputHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasher, inputHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasher = new DataHasher(this.tstInfoAlgorithm);
                        hasher.update(this.tstInfoPrefix.getValue());
                        hasher.update(this.inputHash.getValue().value);
                        hasher.update(this.tstInfoSuffix.getValue());
                        return [4 /*yield*/, hasher.digest()];
                    case 1:
                        inputHash = _a.sent();
                        hasher = new DataHasher(this.signedAttributesAlgorithm);
                        hasher.update(this.signedAttributesPrefix.getValue());
                        hasher.update(inputHash.value);
                        hasher.update(this.signedAttributesSuffix.getValue());
                        return [2 /*return*/, hasher.digest()];
                }
            });
        });
    };
    Rfc3161Record.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.ChainIndexTagType:
                var chainIndexTag = new IntegerTag(tlvTag);
                this.chainIndexes.push(chainIndexTag);
                return chainIndexTag;
            case RFC_3161_RECORD_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType:
                return this.tstInfoPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType:
                return this.tstInfoSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType:
                // TODO: Better solution
                var tstInfoAlgorithmTag = new IntegerTag(tlvTag);
                var tstInfoAlgorithm = HashAlgorithm.getById(tstInfoAlgorithmTag.getValue().valueOf());
                if (tstInfoAlgorithm === null) {
                    throw new Error("Invalid algorithm: " + tstInfoAlgorithmTag.getValue() + ".");
                }
                this.tstInfoAlgorithm = tstInfoAlgorithm;
                return tstInfoAlgorithmTag;
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType:
                return this.signedAttributesPrefix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType:
                return this.signedAttributesSuffix = new RawTag(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType:
                var signedAttributesAlgorithmTag = new IntegerTag(tlvTag);
                var signedAttributesAlgorithm = HashAlgorithm.getById(signedAttributesAlgorithmTag.getValue().valueOf());
                if (signedAttributesAlgorithm === null) {
                    throw new Error("Invalid algorithm: " + signedAttributesAlgorithmTag.getValue() + ".");
                }
                this.signedAttributesAlgorithm = signedAttributesAlgorithm;
                return signedAttributesAlgorithmTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    Rfc3161Record.prototype.validate = function (tagCount) {
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.AggregationTimeTagType) !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in RFC#3161 record.');
        }
        if (this.chainIndexes.length === 0) {
            throw new TlvError('Chain indexes must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoPrefixTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo prefix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoSuffixTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo suffix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TstInfoAlgorithmTagType) !== 1) {
            throw new TlvError('Exactly one tstInfo algorithm must exist in RFC#3161 record.');
        }
        if (this.tstInfoAlgorithm === null) {
            throw new TlvError('Invalid tstInfo algorithm value in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesPrefixTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes prefix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesSuffixTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes suffix must exist in RFC#3161 record.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.SignedAttributesAlgorithmTagType) !== 1) {
            throw new TlvError('Exactly one signed attributes algorithm must exist in RFC#3161 record.');
        }
        if (this.signedAttributesAlgorithm === null) {
            throw new TlvError('Invalid signed attributes algorithm value in RFC#3161 record.');
        }
    };
    return Rfc3161Record;
}(CompositeTag));
export { Rfc3161Record };
