import {TlvStreamConstants} from "../Constants";
import TlvError from "./TlvError";

import TlvTag from "./TlvTag";
export default class TlvInputStream {
    private readonly data: Uint8Array;
    private position: number;
    private readonly length: number;

    constructor(bytes: Uint8Array) {
        this.data = new Uint8Array(bytes);
        this.position = 0;
        this.length = bytes.length;
    }

    public getPosition() {
        return this.position;
    }

    public getLength() {
        return this.length;
    }

    public readTag(): TlvTag {
        const firstByte = this.readByte();
        const tlv16BitFlag = (firstByte & TlvStreamConstants.Tlv16BitFlagBit) !== 0;
        const forwardFlag = (firstByte & TlvStreamConstants.ForwardFlagBit) !== 0;
        const nonCriticalFlag = (firstByte & TlvStreamConstants.NonCriticalFlagBit) !== 0;
        let type = (firstByte & TlvStreamConstants.TypeMask) & 0xFF;
        let length;
        if (tlv16BitFlag) {
            type = (type << 8) | this.readByte();
            length = this.readShort();
        } else {
            length = this.readByte();
        }

        const data = this.read(length);
        return new TlvTag(type, nonCriticalFlag, forwardFlag, data);
    }

    private readByte(): number {
        if (this.length <= this.position) {
            throw new TlvError("Could not read byte: Premature end of data");
        }

        return this.data[this.position++] & 0xFF;
    }

    private readShort(): number {
        return (this.readByte() << 8) | this.readByte();
    }

    private read(length: number): Uint8Array {
        if (this.length < (this.position + length)) {
            throw new TlvError(`Could not read ${length} bytes: Premature end of data`);
        }

        const data = this.data.subarray(this.position, this.position + length);
        this.position += length;
        return data;
    }
}
