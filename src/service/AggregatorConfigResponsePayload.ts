import {AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PduPayload} from './PduPayload';

/**
 * Aggregator configuration response payload.
 */
export class AggregatorConfigResponsePayload extends PduPayload {
    private aggregationPeriod: IntegerTag;
    private aggregationAlgorithm: IntegerTag;
    private maxLevel: IntegerTag;
    private maxRequests: IntegerTag;
    private parentUriList: StringTag[] = [];

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxLevelTagType:
                return this.maxLevel = new IntegerTag(tlvTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationAlgorithmTagType:
                return this.aggregationAlgorithm = new IntegerTag(tlvTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationPeriodTagType:
                return this.aggregationPeriod = new IntegerTag(tlvTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
                return this.maxRequests = new IntegerTag(tlvTag);
            case AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
                const uriTag: StringTag = new StringTag(tlvTag);
                this.parentUriList.push(uriTag);

                return uriTag;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        if (tagCount[AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxLevelTagType] > 1) {
            throw new TlvError('Only one max level tag is allowed in aggregator config response payload.');
        }

        if (tagCount[AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationAlgorithmTagType] > 1) {
            throw new TlvError('Only one aggregation algorithm tag is allowed in aggregator config response payload.');
        }

        if (tagCount[AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.AggregationPeriodTagType] > 1) {
            throw new TlvError('Only one aggregation period tag is allowed in aggregator config response payload.');
        }

        if (tagCount[AGGREGATOR_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType] > 1) {
            throw new TlvError('Only one max requests tag is allowed in aggregator config response payload.');
        }
    }
}
