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
import { DataHash, HMAC } from 'gt-js-common';
import { PDU_CONSTANTS, PDU_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { ErrorPayload } from './ErrorPayload';
import { PduHeader } from './PduHeader';
/**
 * PDU base classs
 */
var Pdu = /** @class */ (function (_super) {
    __extends(Pdu, _super);
    function Pdu(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.payloads = [];
        _this.errorPayload = null;
        return _this;
    }
    Pdu.create = function (tagType, header, payload, algorithm, key) {
        return __awaiter(this, void 0, void 0, function () {
            var pduBytes, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pduBytes = CompositeTag.CREATE_FROM_LIST(tagType, false, false, [
                            header,
                            payload,
                            ImprintTag.CREATE(PDU_CONSTANTS.MacTagType, false, false, DataHash.create(algorithm, new Uint8Array(algorithm.length)))
                        ]).encode();
                        _b = (_a = pduBytes).set;
                        return [4 /*yield*/, HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length))];
                    case 1:
                        _b.apply(_a, [_c.sent(), pduBytes.length - algorithm.length]);
                        return [2 /*return*/, new TlvInputStream(pduBytes).readTag()];
                }
            });
        });
    };
    Pdu.prototype.getErrorPayload = function () {
        return this.errorPayload;
    };
    Pdu.prototype.getPayloads = function () {
        return this.payloads;
    };
    Pdu.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.TagType:
                return this.header = new PduHeader(tlvTag);
            case PDU_CONSTANTS.MacTagType:
                return this.hmac = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    Pdu.prototype.validate = function (tagCount) {
        if (ErrorPayload != null) {
            return;
        }
        if (this.payloads.length === 0) {
            throw new TlvError('Payloads are missing in PDU.');
        }
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one header must exist in PDU.');
        }
        if (this.value[0] !== this.header) {
            throw new TlvError('Header must be the first element in PDU.');
        }
        if (tagCount.getCount(PDU_CONSTANTS.MacTagType) !== 1) {
            throw new TlvError('Exactly one MAC must exist in PDU.');
        }
        if (this.value[this.value.length - 1] !== this.hmac) {
            throw new TlvError('MAC must be the last element in PDU.');
        }
    };
    return Pdu;
}(CompositeTag));
export { Pdu };
