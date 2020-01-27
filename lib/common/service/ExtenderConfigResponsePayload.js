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
import { EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { IntegerTag } from '../parser/IntegerTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration response payload.
 */
export class ExtenderConfigResponsePayload extends PduPayload {
    constructor(tlvTag) {
        super(tlvTag);
        this.parentUriList = [];
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType:
                return this.maxRequests = new IntegerTag(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.ParentUriTagType:
                const uriTag = new StringTag(tlvTag);
                this.parentUriList.push(uriTag);
                return uriTag;
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType:
                return this.calendarFirstTime = new IntegerTag(tlvTag);
            case EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
                return this.calendarLastTime = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.MaxRequestsTagType) > 1) {
            throw new TlvError('Only one max requests tag is allowed in extender config response payload.');
        }
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarFirstTimeTagType) > 1) {
            throw new TlvError('Only one calendar first time tag is allowed in extender config response payload.');
        }
        if (tagCount.getCount(EXTENDER_CONFIG_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
            throw new TlvError('Only one calendar last time tag is allowed in extender config response payload.');
        }
    }
}
