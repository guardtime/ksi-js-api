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

import {PDU_HEADER_CONSTANTS} from '../Constants';
import {CompositeTag, ICount} from '../parser/CompositeTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';

/**
 * PDU header class
 */
export class PduHeader extends CompositeTag {
    private loginId: StringTag;
    private instanceId: IntegerTag;
    private messageId: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE_FROM_LOGIN_ID(loginId: string): PduHeader {
        return new PduHeader(CompositeTag.CREATE_FROM_LIST(PDU_HEADER_CONSTANTS.TagType, false, false, [
            StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId)
        ]));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.LoginIdTagType:
                return this.loginId = new StringTag(tlvTag);
            case PDU_HEADER_CONSTANTS.InstanceIdTagType:
                return this.instanceId = new IntegerTag(tlvTag);
            case PDU_HEADER_CONSTANTS.MessageIdTagType:
                return this.messageId = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    // noinspection JSMethodCanBeStatic
    private validate(tagCount: ICount): void {
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.LoginIdTagType) !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }

        if (tagCount.getCount(PDU_HEADER_CONSTANTS.InstanceIdTagType) > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }

        if (tagCount.getCount(PDU_HEADER_CONSTANTS.MessageIdTagType) > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }
}
