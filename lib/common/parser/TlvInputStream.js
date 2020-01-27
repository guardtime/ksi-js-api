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
import { TlvError } from './TlvError';
import { TlvTag } from './TlvTag';
/**
 * Specialized input stream for decoding TLV data from bytes
 */
export class TlvInputStream {
    constructor(bytes) {
        this.data = new Uint8Array(bytes);
        this.position = 0;
        this.length = bytes.length;
    }
    getPosition() {
        return this.position;
    }
    getLength() {
        return this.length;
    }
    readTag() {
        const firstByte = this.readByte();
        const tlv16BitFlag = (firstByte & TLV_CONSTANTS.Tlv16BitFlagBit) !== 0;
        const forwardFlag = (firstByte & TLV_CONSTANTS.ForwardFlagBit) !== 0;
        const nonCriticalFlag = (firstByte & TLV_CONSTANTS.NonCriticalFlagBit) !== 0;
        let id = (firstByte & TLV_CONSTANTS.TypeMask) & 0xFF;
        let length;
        if (tlv16BitFlag) {
            id = (id << 8) | this.readByte();
            length = this.readShort();
        }
        else {
            length = this.readByte();
        }
        const data = this.read(length);
        return new TlvTag(id, nonCriticalFlag, forwardFlag, data, tlv16BitFlag);
    }
    readByte() {
        if (this.length <= this.position) {
            throw new TlvError('Could not read byte: Premature end of data');
        }
        const byte = this.data[this.position] & 0xFF;
        this.position += 1;
        return byte;
    }
    readShort() {
        return (this.readByte() << 8) | this.readByte();
    }
    read(length) {
        if (this.length < (this.position + length)) {
            throw new TlvError(`Could not read ${length} bytes: Premature end of data`);
        }
        const data = this.data.subarray(this.position, this.position + length);
        this.position += length;
        return data;
    }
}
