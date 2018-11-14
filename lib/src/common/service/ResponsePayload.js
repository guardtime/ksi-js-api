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
import { PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { PduPayload } from './PduPayload';
/**
 * PDU payload base class for responses
 */
var ResponsePayload = /** @class */ (function (_super) {
    __extends(ResponsePayload, _super);
    function ResponsePayload(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.errorMessage = null;
        return _this;
    }
    ResponsePayload.prototype.getStatus = function () {
        return this.status.getValue();
    };
    ResponsePayload.prototype.getErrorMessage = function () {
        return this.errorMessage !== null ? this.errorMessage.getValue() : null;
    };
    ResponsePayload.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.StatusTagType:
                return this.status = new IntegerTag(tlvTag);
            case PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType:
                return this.errorMessage = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    ResponsePayload.prototype.validate = function (tagCount) {
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.StatusTagType) !== 1) {
            throw new TlvError('Exactly one status code must exist in response payload.');
        }
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType) > 1) {
            throw new TlvError('Only one error message is allowed in response payload.');
        }
    };
    return ResponsePayload;
}(PduPayload));
export { ResponsePayload };
