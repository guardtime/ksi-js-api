import {PDU_HEADER_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * PDU header class
 */
export class PduHeader extends CompositeTag {
    private loginId: StringTag;
    private instanceId: IntegerTag;
    private messageId: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE_FROM_LOGIN_ID(loginId: string): PduHeader {
        if ((typeof loginId) !== 'string') {
            throw new TlvError(`Invalid loginId: ${loginId}`);
        }

        return new PduHeader(CompositeTag.createCompositeTagTlv(PDU_HEADER_CONSTANTS.TagType, false, false, [
            StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId)
        ]));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
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

    private validate(tagCount: ITlvCount): void {
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
