import {HashAlgorithm} from '@guardtime/gt-js-common';
import {
    AGGREGATION_REQUEST_PAYLOAD_CONSTANTS,
    AGGREGATION_REQUEST_PDU_CONSTANTS,
    AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS
} from '../Constants';
import {ICount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {AggregationRequestPayload} from './AggregationRequestPayload';
import {AggregatorConfigRequestPayload} from './AggregatorConfigRequestPayload';
import {Pdu} from './Pdu';
import {PduHeader} from './PduHeader';

/**
 * Aggregation request PDU
 */
export class AggregationRequestPdu extends Pdu {
    private aggregatorConfigRequest: AggregatorConfigRequestPayload;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static async CREATE(header: PduHeader, payload: AggregationRequestPayload,
                               algorithm: HashAlgorithm, key: Uint8Array): Promise<AggregationRequestPdu> {
        return new AggregationRequestPdu(await Pdu.create(AGGREGATION_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key));
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const aggregationRequestPayload: AggregationRequestPayload = new AggregationRequestPayload(tlvTag);
                this.payloads.push(aggregationRequestPayload);

                return aggregationRequestPayload;
            case AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                return this.aggregatorConfigRequest = new AggregatorConfigRequestPayload(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ICount): void {
        super.validate(tagCount);

        if (tagCount.getCount(AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one aggregator config request payload is allowed in PDU.');
        }
    }
}
