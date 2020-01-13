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
import { TLV_CONSTANTS } from '../Constants';
import { compareTypedArray } from '../util/Array';
import { TlvError } from './TlvError';
/**
 * TLV objects base class
 */
export class TlvTag {
    constructor(id, nonCriticalFlag, forwardFlag, valueBytes, tlv16BitFlag = false) {
        this.id = id;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytesCopy = new Uint8Array(valueBytes);
        this.getValueBytes = () => new Uint8Array(valueBytesCopy);
        this.tlv16BitFlag = tlv16BitFlag;
        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }
    // tslint:disable-next-line:no-any
    static EQUALS(x, y) {
        if (!(x instanceof TlvTag) || !(y instanceof TlvTag)) {
            return false;
        }
        if (x === y) {
            return true;
        }
        if (x.constructor.name !== y.constructor.name) {
            return false;
        }
        return !(x.id !== y.id
            || x.forwardFlag !== y.forwardFlag
            || x.nonCriticalFlag !== y.nonCriticalFlag
            || !compareTypedArray(x.getValueBytes(), y.getValueBytes()));
    }
    encode() {
        if (this.id > TLV_CONSTANTS.MaxType) {
            throw new TlvError('Could not write TlvTag: Type is larger than max id');
        }
        const valueBytes = this.getValueBytes();
        if (valueBytes.length > 0xFFFF) {
            throw new TlvError('Could not write TlvTag: Data length is too large');
        }
        const tlv16BitFlag = this.id > TLV_CONSTANTS.TypeMask || valueBytes.length > 0xFF || this.tlv16BitFlag;
        let firstByte = (tlv16BitFlag && TLV_CONSTANTS.Tlv16BitFlagBit)
            + (this.nonCriticalFlag && TLV_CONSTANTS.NonCriticalFlagBit)
            + (this.forwardFlag && TLV_CONSTANTS.ForwardFlagBit);
        let result;
        if (tlv16BitFlag) {
            firstByte |= (this.id >> 8) & TLV_CONSTANTS.TypeMask;
            result = new Uint8Array(valueBytes.length + 4);
            result.set([
                firstByte & 0xFF,
                this.id & 0xFF,
                (valueBytes.length >> 8) & 0xFF,
                valueBytes.length & 0xFF
            ]);
            result.set(valueBytes, 4);
        }
        else {
            firstByte |= (this.id & TLV_CONSTANTS.TypeMask);
            result = new Uint8Array(valueBytes.length + 2);
            result.set([firstByte, valueBytes.length & 0xFF]);
            result.set(valueBytes, 2);
        }
        return result;
    }
    // tslint:disable-next-line:no-any
    equals(tag) {
        return TlvTag.EQUALS(this, tag);
    }
}
