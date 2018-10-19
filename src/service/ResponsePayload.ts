import {PDU_PAYLOAD_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';

/**
 * PDU payload base class for responses
 */
export abstract class ResponsePayload extends PduPayload {
    private status: IntegerTag;
    private errorMessage: StringTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.StatusTagType:
                return this.status = new IntegerTag(tlvTag);
            case PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType:
                return this.errorMessage = new StringTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        if (tagCount[PDU_PAYLOAD_CONSTANTS.StatusTagType] !== 1) {
            throw new TlvError('Exactly one status code must exist in response payload.');
        }

        if (tagCount[PDU_PAYLOAD_CONSTANTS.ErrorMessageTagType] > 1) {
            throw new TlvError('Only one error message is allowed in response payload.');
        }
    }
}
