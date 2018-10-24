import { PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { PduPayload } from './PduPayload';
/**
 * PDU payload base class for responses
 */
export class ResponsePayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.errorMessage = null;
    }
    getStatus() {
        return this.status.getValue();
    }
    getErrorMessage() {
        return this.errorMessage !== null ? this.errorMessage.getValue() : null;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.StatusTagType:
                return this.status = new IntegerTag(tlvTag);
            case PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType:
                return this.errorMessage = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount[PDU_PAYLOAD_CONSTANTS.StatusTagType] !== 1) {
            throw new TlvError('Exactly one status code must exist in response payload.');
        }
        if (tagCount[PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType] > 1) {
            throw new TlvError('Only one error message is allowed in response payload.');
        }
    }
}
