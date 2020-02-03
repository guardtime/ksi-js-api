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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EXTEND_REQUEST_PAYLOAD_CONSTANTS, EXTEND_REQUEST_PDU_CONSTANTS, EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS } from '../Constants';
import { TlvError } from '../parser/TlvError';
import { ExtenderConfigRequestPayload } from './ExtenderConfigRequestPayload';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { Pdu } from './Pdu';
/**
 * Extend request PDU
 */
export class ExtendRequestPdu extends Pdu {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    static CREATE(header, payload, algorithm, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtendRequestPdu(yield Pdu.create(EXTEND_REQUEST_PDU_CONSTANTS.TagType, header, payload, algorithm, key));
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case EXTEND_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const extendRequestPayload = new ExtendRequestPayload(tlvTag);
                this.payloads.push(extendRequestPayload);
                return extendRequestPayload;
            case EXTENDER_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                return this.extenderConfigRequest = new ExtenderConfigRequestPayload(tlvTag);
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
