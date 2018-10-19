import {HashAlgorithm} from 'gt-js-common';
import {
    AGGREGATION_REQUEST_PAYLOAD_CONSTANTS,
    AGGREGATION_REQUEST_PDU_CONSTANTS,
    AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS,
    PDU_HEADER_CONSTANTS
} from '../Constants';
import {ITlvCount} from '../parser/CompositeTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {Pdu} from './Pdu';
import {PduHeader} from './PduHeader';
import {AggregationRequestPayload} from './AggregationRequestPayload';

/**
 * Aggregation request PDU
 */
export class AggregationRequestPdu extends Pdu {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static async CREATE(header: PduHeader, payload: AggregationRequestPayload,
                               algorithm: HashAlgorithm, key: Uint8Array): Promise<AggregationRequestPdu> {
        return new AggregationRequestPdu(await Pdu.CREATE_PDU(AGGREGATION_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key));
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const aggregationRequestPayload: AggregationRequestPayload = new AggregationRequestPayload(tlvTag);
                this.payloads.push(aggregationRequestPayload);

                return aggregationRequestPayload;
            case AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                // TODO: Is this part of request?
                return new TlvTag(0, false, false, new Uint8Array(0));
            // AggregatorConfigRequestPayload; aggregatorConfigRequestPayload = childTag as AggregatorConfigRequestPayload ? ? new AggregatorConfigRequestPayload(childTag) ;
            // Payloads.Add(aggregatorConfigRequestPayload);
            // return aggregatorConfigRequestPayload;
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
