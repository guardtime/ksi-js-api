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
import { PDU_PAYLOAD_CONSTANTS } from '../Constants';
import { IntegerTag } from '../parser/IntegerTag';
import { TlvError } from '../parser/TlvError';
import { ResponsePayload } from './ResponsePayload';
/**
 * PDU payload base class for requested responses
 */
export class RequestResponsePayload extends ResponsePayload {
    constructor(tlvTag) {
        super(tlvTag);
    }
    getRequestId() {
        return this.requestId.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount.getCount(PDU_PAYLOAD_CONSTANTS.RequestIdTagType) !== 1) {
            throw new TlvError('Exactly one request id must exist in response payload.');
        }
    }
}
