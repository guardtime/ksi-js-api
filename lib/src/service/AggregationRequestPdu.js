var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AGGREGATION_REQUEST_PAYLOAD_CONSTANTS, AGGREGATION_REQUEST_PDU_CONSTANTS, AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS } from '../Constants';
import { TlvError } from '../parser/TlvError';
import { AggregationRequestPayload } from './AggregationRequestPayload';
import { AggregatorConfigRequestPayload } from './AggregatorConfigRequestPayload';
import { Pdu } from './Pdu';
/**
 * Aggregation request PDU
 */
export class AggregationRequestPdu extends Pdu {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(header, payload, algorithm, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AggregationRequestPdu(yield Pdu.create(AGGREGATION_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key));
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const aggregationRequestPayload = new AggregationRequestPayload(tlvTag);
                this.payloads.push(aggregationRequestPayload);
                return aggregationRequestPayload;
            case AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                return this.aggregatorConfigRequest = new AggregatorConfigRequestPayload(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount[AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType] > 1) {
            throw new TlvError('Only one aggregator config request payload is allowed in PDU.');
        }
    }
}
