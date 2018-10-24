import { PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { ResponsePayload } from './ResponsePayload';
/**
 * PDU payload base class for requested responses
 */
export class RequestResponsePayload extends ResponsePayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
    getRequestId() {
        return this.requestId.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount[PDU_PAYLOAD_CONSTANTS.RequestIdTagType] !== 1) {
            throw new TlvError('Exactly one request id must exist in response payload.');
        }
    }
}
