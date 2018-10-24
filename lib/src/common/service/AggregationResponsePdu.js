import { AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS, AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS, AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS, ERROR_PAYLOAD_CONSTANTS } from '../Constants';
import { TlvError } from '../parser/TlvError';
import { AggregationErrorPayload } from './AggregationErrorPayload';
import { AggregationResponsePayload } from './AggregationResponsePayload';
import { AggregatorConfigResponsePayload } from './AggregatorConfigResponsePayload';
import { Pdu } from './Pdu';
/**
 * Aggregation response PDU
 */
export class AggregationResponsePdu extends Pdu {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                const aggregationResponsePayload = new AggregationResponsePayload(tlvTag);
                this.payloads.push(aggregationResponsePayload);
                return aggregationResponsePayload;
            case ERROR_PAYLOAD_CONSTANTS.TagType:
                return this.errorPayload = new AggregationErrorPayload(tlvTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return this.aggregatorConfigResponse = new AggregatorConfigResponsePayload(tlvTag);
            // not implemented yet, so just return the tag
            case AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount[AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one aggregator config response payload is allowed in PDU.');
        }
    }
}
