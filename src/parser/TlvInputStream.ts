import {TLV_STREAM_CONSTANTS} from '../Constants';
import {TlvError} from './TlvError';
import {TlvTag} from './TlvTag';

/**
 * Specialized input stream for decoding TLV data from bytes
 */
export class TlvInputStream {
    private readonly data: Uint8Array;
    private position: number;
    private readonly length: number;

    constructor(bytes: Uint8Array) {
        this.data = new Uint8Array(bytes);
        this.position = 0;
        this.length = bytes.length;
    }

    public getPosition(): number {
        return this.position;
    }

    public getLength(): number {
        return this.length;
    }

    public readTag(): TlvTag {
        const firstByte: number = this.readByte();
        const tlv16BitFlag: boolean = (firstByte & TLV_STREAM_CONSTANTS.Tlv16BitFlagBit) !== 0;
        const forwardFlag: boolean = (firstByte & TLV_STREAM_CONSTANTS.ForwardFlagBit) !== 0;
        const nonCriticalFlag: boolean = (firstByte & TLV_STREAM_CONSTANTS.NonCriticalFlagBit) !== 0;
        let id: number = (firstByte & TLV_STREAM_CONSTANTS.TypeMask) & 0xFF;
        let length: number;
        if (tlv16BitFlag) {
            id = (id << 8) | this.readByte();
            length = this.readShort();
        } else {
            length = this.readByte();
        }

        const data: Uint8Array = this.read(length);

        return new TlvTag(id, nonCriticalFlag, forwardFlag, data);
    }

    private readByte(): number {
        if (this.length <= this.position) {
            throw new TlvError('Could not read byte: Premature end of data');
        }

        const byte: number = this.data[this.position] & 0xFF;
        this.position += 1;

        return byte;
    }

    private readShort(): number {
        return (this.readByte() << 8) | this.readByte();
    }

    private read(length: number): Uint8Array {
        if (this.length < (this.position + length)) {
            throw new TlvError(`Could not read ${length} bytes: Premature end of data`);
        }

        const data: Uint8Array = this.data.subarray(this.position, this.position + length);
        this.position += length;

        return data;
    }
}
