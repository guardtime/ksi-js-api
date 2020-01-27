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
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
            throw new TlvError('Exactly one request id must exist in extend request payload.');
        }
        if (tagCount.getCount(EXTEND_REQUEST_PAYLOAD_CONSTANTS.AggregationTimeTagType) !== 1) {
            throw new TlvError('Exactly one aggregation time must exist in extend request payload.');
        }
        if (tagCount.getCount(EXTEND_REQUEST_PAYLOAD_CONSTANTS.PublicationTimeTagType) > 1) {
            throw new TlvError('Only one publication time is allowed in extend request payload.');
        }
    }
}
