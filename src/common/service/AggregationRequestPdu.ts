/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

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
