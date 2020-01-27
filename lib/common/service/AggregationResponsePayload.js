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
import { AGGREGATION_HASH_CHAIN_CONSTANTS, CALENDAR_AUTHENTICATION_RECORD_CONSTANTS, CALENDAR_HASH_CHAIN_CONSTANTS, EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS, KSI_SIGNATURE_CONSTANTS } from '../Constants';
import { TlvError } from '../parser/TlvError';
import { RequestResponsePayload } from './RequestResponsePayload';
/**
 * Aggregation response payload
 */
export class AggregationResponsePayload extends RequestResponsePayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        Object.freeze(this);
    }
    getSignatureTags() {
        const tlvList = [];
        for (const tlvTag of this.value) {
            if (tlvTag.id > 0x800 && tlvTag.id < 0x900) {
                tlvList.push(tlvTag);
            }
        }
        return tlvList;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case AGGREGATION_HASH_CHAIN_CONSTANTS.TagType:
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
            case KSI_SIGNATURE_CONSTANTS.PublicationRecordTagType:
            case CALENDAR_AUTHENTICATION_RECORD_CONSTANTS.TagType:
                return tlvTag;
            default:
                return super.parseChild(tlvTag);
        }
    }
    validate(tagCount) {
        super.validate(tagCount);
        if (tagCount.getCount(EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType) > 1) {
            throw new TlvError('Only one extender config request payload is allowed in PDU.');
        }
    }
}
