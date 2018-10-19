import {HashAlgorithm} from 'gt-js-common';
import {
    AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS,
    AGGREGATION_REQUEST_PDU_CONSTANTS,
    AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS,
    AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS,
    ERROR_PAYLOAD_CONSTANTS,
    PDU_HEADER_CONSTANTS
} from '../Constants';
import {ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {AggregationResponsePayload} from './AggregationResponsePayload';
import {Pdu} from './Pdu';
import {PduPayload} from './PduPayload';

/**
 * Aggregation response PDU
 */
export class AggregationResponsePdu extends Pdu {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                const aggregationResponsePayload: AggregationResponsePayload = new AggregationResponsePayload(tlvTag);
                this.payloads.push(aggregationResponsePayload);

                return aggregationResponsePayload;
            case ERROR_PAYLOAD_CONSTANTS.TagType:
            // return ErrorPayload = childTag as AggregationErrorPayload ?? new AggregationErrorPayload(childTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
            // AggregatorConfigResponsePayload aggregatorConfigResponsePayload = childTag as AggregatorConfigResponsePayload ?? new AggregatorConfigResponsePayload(childTag);
            // Payloads.Add(aggregatorConfigResponsePayload);
            // return aggregatorConfigResponsePayload;
            // not implemented yet, so just return the tag
            case AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        super.validate(tagCount);

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
