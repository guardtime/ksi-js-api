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
import { PDU_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
/**
 * PDU header class
 */
var PduHeader = /** @class */ (function (_super) {
    __extends(PduHeader, _super);
    function PduHeader(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    PduHeader.CREATE_FROM_LOGIN_ID = function (loginId) {
        return new PduHeader(CompositeTag.CREATE_FROM_LIST(PDU_HEADER_CONSTANTS.TagType, false, false, [
            StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId)
        ]));
    };
    PduHeader.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.LoginIdTagType:
                return this.loginId = new StringTag(tlvTag);
            case PDU_HEADER_CONSTANTS.InstanceIdTagType:
                return this.instanceId = new IntegerTag(tlvTag);
            case PDU_HEADER_CONSTANTS.MessageIdTagType:
                return this.messageId = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    PduHeader.prototype.validate = function (tagCount) {
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.LoginIdTagType) !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.InstanceIdTagType) > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.MessageIdTagType) > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    };
    return PduHeader;
}(CompositeTag));
export { PduHeader };
