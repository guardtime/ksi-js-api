import bigInteger from 'big-integer';
import { EXTEND_REQUEST_PAYLOAD_CONSTANTS, PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { PduPayload } from './PduPayload';
/**
 * Aggregation request payload
 */
export class ExtendRequestPayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(requestId, aggregationTime, publicationTime = null) {
        if (!bigInteger.isInstance(requestId)) {
            throw new TlvError(`Invalid requestId: ${requestId}`);
        }
        if (!bigInteger.isInstance(aggregationTime)) {
            throw new TlvError(`Invalid aggregation time: ${aggregationTime}`);
        }
        if (publicationTime !== null && !bigInteger.isInstance(publicationTime)) {
            throw new TlvError(`Invalid publication time: ${publicationTime}`);
        }
        const childTlv = [
            IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
            IntegerTag.CREATE(EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType, false, false, aggregationTime)
        ];
        if (publicationTime !== null) {
            childTlv.push(IntegerTag.CREATE(EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType, false, false, publicationTime));
        }
        return new ExtendRequestPayload(CompositeTag.CREATE_FROM_LIST(EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv));
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            case EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType:
                return this.aggregationTime = new IntegerTag(tlvTag);
            case EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType:
                return this.publicationTime = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (tagCount[PDU_PAYLOAD_CONSTANTS.RequestIdTagType] !== 1) {
            throw new TlvError('Exactly one request id must exist in extend request payload.');
        }
        if (tagCount[EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType] !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in extend request payload.');
        }
        if (tagCount[EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType] > 1) {
            throw new TlvError('Only one publication time is allowed in extend request payload.');
        }
    }
}
