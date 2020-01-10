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
import { DataHash, HMAC } from '@guardtime/gt-js-common';
import { PDU_CONSTANTS, PDU_HEADER_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { ImprintTag } from '../parser/ImprintTag';
import { TlvError } from '../parser/TlvError';
import { TlvInputStream } from '../parser/TlvInputStream';
import { ErrorPayload } from './ErrorPayload';
import { PduHeader } from './PduHeader';
/**
 * PDU base classs
 */
export class Pdu extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.payloads = [];
        this.errorPayload = null;
    }
    static create(tagType, header, payload, algorithm, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const pduBytes = CompositeTag.CREATE_FROM_LIST(tagType, false, false, [
                header,
                payload,
                ImprintTag.CREATE(PDU_CONSTANTS.MacTagType, false, false, DataHash.create(algorithm, new Uint8Array(algorithm.length)))
            ]).encode();
            pduBytes.set(yield HMAC.digest(algorithm, key, pduBytes.slice(0, -algorithm.length)), pduBytes.length - algorithm.length);
            return new TlvInputStream(pduBytes).readTag();
        });
    }
    getErrorPayload() {
        return this.errorPayload;
    }
    getPayloads() {
        return this.payloads;
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.TagType:
                return this.header = new PduHeader(tlvTag);
            case PDU_CONSTANTS.MacTagType:
                return this.hmac = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    validate(tagCount) {
        if (ErrorPayload != null) {
            return;
        }
        if (this.payloads.length === 0) {
            throw new TlvError('Payloads are missing in PDU.');
        }
        if (tagCount.getCount(PDU_HEADER_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one header must exist in PDU.');
        }
        if (this.value[0] !== this.header) {
            throw new TlvError('Header must be the first element in PDU.');
        }
        if (tagCount.getCount(PDU_CONSTANTS.MacTagType) !== 1) {
            throw new TlvError('Exactly one MAC must exist in PDU.');
        }
        if (this.value[this.value.length - 1] !== this.hmac) {
            throw new TlvError('MAC must be the last element in PDU.');
        }
    }
}
