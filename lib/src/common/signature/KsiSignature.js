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
import { Base64Coder } from 'gt-js-common';
import { AGGREGATION_HASH_CHAIN_CONSTANTS, CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, CALENDAR_HASH_CHAIN_CONSTANTS, KSI_SIGNATURE_CONSTANTS, RFC_3161_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { TlvOutputStream } from '../parser/TlvOutputStream';
import { TlvTag } from '../parser/TlvTag';
import { PublicationRecord } from '../publication/PublicationRecord';
import { AggregationHashChain } from './AggregationHashChain';
import { CalendarAuthenticationRecord } from './CalendarAuthenticationRecord';
import { CalendarHashChain } from './CalendarHashChain';
import { Rfc3161Record } from './Rfc3161Record';
/**
 * KSI Signature TLV object
 */
var KsiSignature = /** @class */ (function (_super) {
    __extends(KsiSignature, _super);
    function KsiSignature(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.aggregationHashChains = [];
        _this.publicationRecord = null;
        _this.calendarAuthenticationRecord = null;
        _this.calendarHashChain = null;
        _this.rfc3161Record = null;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        _this.aggregationHashChains.sort(function (x, y) {
            return y.getChainIndex().length - x.getChainIndex().length;
        });
        Object.freeze(_this);
        return _this;
    }
    KsiSignature.CREATE = function (payload) {
        return new KsiSignature(CompositeTag.CREATE_FROM_LIST(KSI_SIGNATURE_CONSTANTS.TagType, false, false, payload.getSignatureTags()));
    };
    KsiSignature.CREATE_FROM_BASE64 = function (value) {
        return new KsiSignature(new TlvInputStream(Base64Coder.decode(value)).readTag());
    };
    KsiSignature.prototype.getPublicationRecord = function () {
        return this.publicationRecord;
    };
    KsiSignature.prototype.getCalendarHashChain = function () {
        return this.calendarHashChain;
    };
    KsiSignature.prototype.getAggregationTime = function () {
        return this.aggregationHashChains[0].getAggregationTime();
    };
    KsiSignature.prototype.getAggregationHashChains = function () {
        return this.aggregationHashChains.slice();
    };
    /**
     * Get last aggregation hash chain output hash that is calculated from all aggregation hash chains
     */
    KsiSignature.prototype.getLastAggregationHashChainRootHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastResult, _i, _a, chain;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        lastResult = { level: bigInteger(0), hash: this.aggregationHashChains[0].getInputHash() };
                        _i = 0, _a = this.aggregationHashChains;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        chain = _a[_i];
                        return [4 /*yield*/, chain.getOutputHash(lastResult)];
                    case 2:
                        lastResult = _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, lastResult.hash];
                }
            });
        });
    };
    KsiSignature.prototype.getInputHash = function () {
        return this.rfc3161Record !== null ? this.rfc3161Record.getInputHash() : this.aggregationHashChains[0].getInputHash();
    };
    KsiSignature.prototype.getRfc3161Record = function () {
        return this.rfc3161Record;
    };
    KsiSignature.prototype.getCalendarAuthenticationRecord = function () {
        return this.calendarAuthenticationRecord;
    };
    KsiSignature.prototype.getIdentity = function () {
        var identity = [];
        for (var i = this.aggregationHashChains.length - 1; i >= 0; i -= 1) {
            identity.push.apply(identity, this.aggregationHashChains[i].getIdentity());
        }
        return identity;
    };
    KsiSignature.prototype.isExtended = function () {
        return this.publicationRecord != null;
    };
    KsiSignature.prototype.extend = function (calendarHashChain, publicationRecord) {
        var stream = new TlvOutputStream();
        for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
            var childTag = _a[_i];
            switch (childTag.id) {
                case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
                    break;
                default:
                    stream.writeTag(childTag);
            }
        }
        stream.writeTag(calendarHashChain);
        stream.writeTag(CompositeTag.createFromCompositeTag(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType, publicationRecord));
        return new KsiSignature(new TlvTag(KSI_SIGNATURE_CONSTANTS.TagType, false, false, stream.getData()));
    };
    KsiSignature.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
                var aggregationHashChain = new AggregationHashChain(tlvTag);
                this.aggregationHashChains.push(aggregationHashChain);
                return aggregationHashChain;
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                return this.calendarHashChain = new CalendarHashChain(tlvTag);
            case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
                return this.publicationRecord = new PublicationRecord(tlvTag);
            case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                return this.calendarAuthenticationRecord = new CalendarAuthenticationRecord(tlvTag);
            case RFC_3161_RECORD_CONSTANTS.TagType:
                return this.rfc3161Record = new Rfc3161Record(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    KsiSignature.prototype.validate = function (tagCount) {
        if (this.aggregationHashChains.length === 0) {
            throw new TlvError('Aggregation hash chains must exist in KSI signature.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one calendar hash chain is allowed in KSI signature.');
        }
        if (tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) === 0
            && (tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) !== 0
                || tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) !== 0)) {
            throw new TlvError('No publication record or calendar authentication record is ' +
                'allowed in KSI signature if there is no calendar hash chain.');
        }
        if ((tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) === 1 &&
            tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) === 1) ||
            tagCount.getCount(KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType) > 1 ||
            tagCount.getCount(CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one from publication record or calendar authentication record is allowed in KSI signature.');
        }
        if (tagCount.getCount(RFC_3161_RECORD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one RFC 3161 record is allowed in KSI signature.');
        }
    };
    return KsiSignature;
}(CompositeTag));
export { KsiSignature };
