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
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { ResponsePayload } from './ResponsePayload';
/**
 * PDU payload base class for requested responses
 */
var RequestResponsePayload = /** @class */ (function (_super) {
    __extends(RequestResponsePayload, _super);
    function RequestResponsePayload(tlvTag) {
        return _super.call(this, tlvTag) || this;
    }
    RequestResponsePayload.prototype.getRequestId = function () {
        return this.requestId.getValue();
    };
    RequestResponsePayload.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            default:
                return _super.prototype.parseChild.call(this, tlvTag);
        }
    };
    RequestResponsePayload.prototype.validate = function (tagCount) {
        _super.prototype.validate.call(this, tagCount);
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
            throw new TlvError('Exactly one request id must exist in response payload.');
        }
    };
    return RequestResponsePayload;
}(ResponsePayload));
export { RequestResponsePayload };
