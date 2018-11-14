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
import { SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
/**
 * Signature data TLV Object
 */
var SignatureData = /** @class */ (function (_super) {
    __extends(SignatureData, _super);
    function SignatureData(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    SignatureData.prototype.getSignatureType = function () {
        return this.signatureType.getValue();
    };
    SignatureData.prototype.getCertificateId = function () {
        return this.certificateId.getValue();
    };
    SignatureData.prototype.getSignatureValue = function () {
        return this.signatureValue.getValue();
    };
    SignatureData.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType:
                return this.signatureType = new StringTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.SignatureValueTagType:
                return this.signatureValue = new RawTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.CertificateIdTagType:
                return this.certificateId = new RawTag(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType:
                return this.certificateRepositoryUri = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    SignatureData.prototype.validate = function (tagCount) {
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.SignatureTypeTagType) !== 1) {
            throw new TlvError('Exactly one signature type must exist in signature data.');
        }
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.SignatureValueTagType) !== 1) {
            throw new TlvError('Exactly one signature value must exist in signature data.');
        }
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.CertificateIdTagType) !== 1) {
            throw new TlvError('Exactly one certificate id must exist in signature data.');
        }
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.CertificateRepositoryUriTagType) > 1) {
            throw new TlvError('Only one certificate repository uri is allowed in signature data.');
        }
    };
    return SignatureData;
}(CompositeTag));
export { SignatureData };
