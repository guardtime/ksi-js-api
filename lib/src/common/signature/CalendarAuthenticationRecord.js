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
import { PUBLICATION_DATA_CONSTANTS, SIGNATURE_DATA_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvError } from '../parser/TlvError';
import { PublicationData } from '../publication/PublicationData';
import { SignatureData } from './SignatureData';
/**
 * Calendar Authentication Record TLV Object
 */
var CalendarAuthenticationRecord = /** @class */ (function (_super) {
    __extends(CalendarAuthenticationRecord, _super);
    function CalendarAuthenticationRecord(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.parseChild.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    CalendarAuthenticationRecord.prototype.getPublicationData = function () {
        return this.publicationData;
    };
    CalendarAuthenticationRecord.prototype.getSignatureData = function () {
        return this.signatureData;
    };
    CalendarAuthenticationRecord.prototype.parseChild = function (tlvTag) {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case SIGNATURE_DATA_CONSTANTS.TagType:
                return this.signatureData = new SignatureData(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    };
    CalendarAuthenticationRecord.prototype.validate = function (tagCount) {
        if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one publication data must exist in calendar authentication record.');
        }
        if (tagCount.getCount(SIGNATURE_DATA_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one signature data must exist in calendar authentication record.');
        }
    };
    return CalendarAuthenticationRecord;
}(CompositeTag));
export { CalendarAuthenticationRecord };
