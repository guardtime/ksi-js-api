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
import bigInteger from 'big-integer';
import { AGGREGATION_REQUEST_PAYLOAD_CONSTANTS, PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
/**
 * Aggregation request payload
 */
export class AggregationRequestPayload extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(requestId, hash, level = bigInteger(0)) {
        const childTlv = [
            IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
            ImprintTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType, false, false, hash)
        ];
        if (level.neq(0)) {
            childTlv.push(IntegerTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType, false, false, level));
        }
        return new AggregationRequestPayload(CompositeTag.CREATE_FROM_LIST(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv));
    }
    parseChild(tlvTag) {
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
    validate(tagCount) {
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