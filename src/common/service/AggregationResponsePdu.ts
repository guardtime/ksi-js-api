import {
    AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS,
    AGGREGATION_RESPONSE_PAYLOAD_CONSTANTS,
    AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS,
    ERROR_PAYLOAD_CONSTANTS
} from '../Constants';
import {ICount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {AggregationErrorPayload} from './AggregationErrorPayload';
import {AggregationResponsePayload} from './AggregationResponsePayload';
import {AggregatorConfigResponsePayload} from './AggregatorConfigResponsePayload';
import {Pdu} from './Pdu';

/**
 * Aggregation response PDU
 */
export class AggregationResponsePdu extends Pdu {
    private aggregatorConfigResponse: AggregatorConfigResponsePayload;

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

    protected validate(tagCount: ICount): void {
        super.validate(tagCount);

        if (tagCount.getCount(AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one aggregator config response payload is allowed in PDU.');
        }
    }
}
