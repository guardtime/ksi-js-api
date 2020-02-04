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
import { AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS, ERROR_PAYLOAD_CONSTANTS, EXTEND_RESPONSE_PAYLOAD_CONSTANTS, EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { TlvError } from '../parser/TlvError';
import { ExtenderConfigResponsePayload } from './ExtenderConfigResponsePayload';
import { ExtendErrorPayload } from './ExtendErrorPayload';
import { ExtendResponsePayload } from './ExtendResponsePayload';
import { Pdu } from './Pdu';
/**
 * Extend response PDU
 */
export class ExtendResponsePdu extends Pdu {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                const extendResponsePayload = new ExtendResponsePayload(tlvTag);
                this.payloads.push(extendResponsePayload);
                return extendResponsePayload;
            case ERROR_PAYLOAD_CONSTANTS.TagType:
                return this.errorPayload = new ExtendErrorPayload(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return this.extenderConfigResponse = new ExtenderConfigResponsePayload(tlvTag);
            // not implemented yet, so just return the tag
            case AGGREGATION_ACKNOWLEDGMENT_RESPONSE_PAYLOAD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one extender config response payload is allowed in PDU.');
        }
    }
}
