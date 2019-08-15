import {DataHash} from '@guardtime/gt-js-common';
import bigInteger, {BigInteger} from 'big-integer';
import {AGGREGATION_REQUEST_PAYLOAD_CONSTANTS, PDU_PAYLOAD_CONSTANTS} from '../Constants';
import {CompositeTag, ICount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * Aggregation request payload
 */
export class AggregationRequestPayload extends CompositeTag {
    private requestId: IntegerTag;
    private requestHash: ImprintTag;
    private requestLevel: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE(requestId: BigInteger, hash: DataHash, level: BigInteger = bigInteger(0)): AggregationRequestPayload {
        const childTlv: TlvTag[] = [
            IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
            ImprintTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType, false, false, hash)
        ];

        if (level.neq(0)) {
            childTlv.push(IntegerTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType, false, false, level));
        }

        return new AggregationRequestPayload(
            CompositeTag.CREATE_FROM_LIST(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType:
                return this.requestHash = new ImprintTag(tlvTag);
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType:
                return this.requestLevel = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    // noinspection JSMethodCanBeStatic
    private validate(tagCount: ICount): void {
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
            throw new TlvError('Exactly one request id must exist in aggregation request payload.');
        }

        if (tagCount.getCount(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType) !== 1) {
            throw new TlvError('Exactly one request hash must exist in aggregation request payload.');
        }

        if (tagCount.getCount(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType) > 1) {
            throw new TlvError('Only one request level is allowed in aggregation request payload.');
        }
    }
}
