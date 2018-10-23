import { PDU_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
/**
 * PDU header class
 */
export class PduHeader extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE_FROM_LOGIN_ID(loginId) {
        if ((typeof loginId) !== 'string') {
            throw new TlvError(`Invalid loginId: ${loginId}`);
        }
        return new PduHeader(CompositeTag.createFromList(PDU_HEADER_CONSTANTS.TagType, false, false, [
            StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId)
        ]));
    }
    parseChild(tlvTag) {
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
    }
    validate(tagCount) {
        if (tagCount[PDU_HEADER_CONSTANTS.LoginIdTagType] !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }
        if (tagCount[PDU_HEADER_CONSTANTS.InstanceIdTagType] > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }
        if (tagCount[PDU_HEADER_CONSTANTS.MessageIdTagType] > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }
}
