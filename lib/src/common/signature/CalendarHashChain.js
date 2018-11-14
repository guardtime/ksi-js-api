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
import { DataHasher } from 'gt-js-common';
import { CALENDAR_HASH_CHAIN_CONSTANTS, LinkDirection } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { PublicationData } from '../publication/PublicationData';
/**
 * Calendar Hash Chain TLV Object
 */
var CalendarHashChain = /** @class */ (function (_super) {
    __extends(CalendarHashChain, _super);
    function CalendarHashChain(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.chainLinks = [];
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    /**
     * Calculate highest bit.
     */
    CalendarHashChain.highBit = function (n) {
        var v = n;
        v = v.or(v.shiftRight(1));
        v = v.or(v.shiftRight(2));
        v = v.or(v.shiftRight(4));
        v = v.or(v.shiftRight(8));
        v = v.or(v.shiftRight(16));
        v = v.or(v.shiftRight(32));
        return v.minus(v.shiftRight(1));
    };
    /**
     * Hash two hashes together with algorithm.
     */
    CalendarHashChain.getStepHash = function (algorithm, hashA, hashB) {
        return __awaiter(this, void 0, void 0, function () {
            var hasher;
            return __generator(this, function (_a) {
                hasher = new DataHasher(algorithm);
                hasher.update(hashA);
                hasher.update(hashB);
                hasher.update(new Uint8Array([0xFF]));
                return [2 /*return*/, hasher.digest()];
            });
        });
    };
    /**
     * Compare right links if they are equal.
     */
    CalendarHashChain.prototype.areRightLinksEqual = function (calendarHashChain) {
        var i = 0;
        var j = 0;
        while (i < this.chainLinks.length || j < calendarHashChain.chainLinks.length) {
            if (this.chainLinks[i].id !== LinkDirection.Right) {
                i += 1;
                continue;
            }
            if (calendarHashChain.chainLinks[j].id !== LinkDirection.Right) {
                j += 1;
                continue;
            }
            if (!this.chainLinks[i].getValue().equals(calendarHashChain.chainLinks[j].getValue())) {
                return false;
            }
            i += 1;
            j += 1;
        }
        return true;
    };
    CalendarHashChain.prototype.calculateRegistrationTime = function () {
        var r = this.publicationTime.getValue();
        var t = bigInteger(0);
        // iterate over the chain in reverse
        for (var i = this.chainLinks.length - 1; i >= 0; i -= 1) {
            if (r.leq(0)) {
                console.warn('Invalid calendar hash chain shape for publication time. Cannot calculate registration time.');
                return bigInteger(0);
            }
            if (this.chainLinks[i].id === LinkDirection.Left) {
                r = CalendarHashChain.highBit(r).minus(1);
            }
            else {
                t = t.plus(CalendarHashChain.highBit(r));
                r = r.minus(CalendarHashChain.highBit(r));
            }
        }
        if (r.neq(0)) {
            console.warn('Calendar hash chain shape inconsistent with publication time. Cannot calculate registration time.');
            return bigInteger(0);
        }
        return t;
    };
    CalendarHashChain.prototype.getChainLinks = function () {
        return this.chainLinks;
    };
    CalendarHashChain.prototype.getPublicationTime = function () {
        return this.publicationTime.getValue();
    };
    CalendarHashChain.prototype.getInputHash = function () {
        return this.inputHash.getValue();
    };
    CalendarHashChain.prototype.getAggregationTime = function () {
        return this.aggregationTime ? this.aggregationTime.getValue() : this.getPublicationTime();
    };
    /**
     * Calculate output hash.
     */
    CalendarHashChain.prototype.calculateOutputHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inputHash, _i, _a, link, siblingHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inputHash = this.getInputHash();
                        _i = 0, _a = this.getChainLinks();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        link = _a[_i];
                        siblingHash = link.getValue();
                        if (!(link.id === LinkDirection.Left)) return [3 /*break*/, 3];
                        return [4 /*yield*/, CalendarHashChain.getStepHash(siblingHash.hashAlgorithm, inputHash.imprint, siblingHash.imprint)];
                    case 2:
                        inputHash = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!(link.id === LinkDirection.Right)) return [3 /*break*/, 5];
                        return [4 /*yield*/, CalendarHashChain.getStepHash(inputHash.hashAlgorithm, siblingHash.imprint, inputHash.imprint)];
                    case 4:
                        inputHash = _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, inputHash];
                }
            });
        });
    };
    CalendarHashChain.prototype.getPublicationData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = PublicationData).CREATE;
                        _c = [this.publicationTime.getValue()];
                        return [4 /*yield*/, this.calculateOutputHash()];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
                }
            });
        });
    };
    CalendarHashChain.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType:
                return this.inputHash = new ImprintTag(tlvTag);
            case LinkDirection.Left:
            case LinkDirection.Right:
                var link = new ImprintTag(tlvTag);
                this.chainLinks.push(link);
                return link;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    CalendarHashChain.prototype.validate = function (tagCount) {
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.PublicationTimeTagType) !== 1) {
            throw new TlvError('Exactly one publication time must exist in calendar hash chain.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.AggregationTimeTagType) > 1) {
            throw new TlvError('Only one aggregation time is allowed in calendar hash chain.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.InputHashTagType) !== 1) {
            throw new TlvError('Exactly one input hash must exist in calendar hash chain.');
        }
        if (this.chainLinks.length === 0) {
            throw new TlvError('Links are missing in calendar hash chain.');
        }
    };
    return CalendarHashChain;
}(CompositeTag));
export { CalendarHashChain };
