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

import {CALENDAR_HASH_CHAIN_CONSTANTS, EXTEND_RESPONSE_PAYLOAD_CONSTANTS} from '../Constants';
import {ICount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {CalendarHashChain} from '../signature/CalendarHashChain';
import {RequestResponsePayload} from './RequestResponsePayload';

/**
 * Extend response payload
 */
export class ExtendResponsePayload extends RequestResponsePayload {

    private calendarLastTime: IntegerTag;
    private calendarHashChain: CalendarHashChain;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public getCalendarHashChain(): CalendarHashChain {
        return this.calendarHashChain;
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType:
                return this.calendarLastTime = new IntegerTag(tlvTag);
            case CALENDAR_HASH_CHAIN_CONSTANTS.TagType:
                return this.calendarHashChain = new CalendarHashChain(tlvTag);
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ICount): void {
        super.validate(tagCount);

        if (tagCount.getCount(EXTEND_RESPONSE_PAYLOAD_CONSTANTS.CalendarLastTimeTagType) > 1) {
            throw new TlvError('Only one calendar last time is allowed in extend response payload.');
        }

        if (this.getStatus().eq(0) && tagCount.getCount(CALENDAR_HASH_CHAIN_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one calendar hash chain must exist in extend response payload.');
        }
    }
}
