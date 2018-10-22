import {PDU_PAYLOAD_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';
import {ResponsePayload} from './ResponsePayload';
import {BigInteger} from 'big-integer';

/**
 * PDU payload base class for requested responses
 */
export abstract class RequestResponsePayload extends ResponsePayload {
    private requestId: IntegerTag;

    protected constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

    public getRequestId(): BigInteger {
        return this.requestId.getValue();
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        super.validate(tagCount);

        if (tagCount[PDU_PAYLOAD_CONSTANTS.RequestIdTagType] !== 1) {
            throw new TlvError('Exactly one request id must exist in response payload.');
        }
    }
}
