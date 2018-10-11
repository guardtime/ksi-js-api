import {util} from 'node-forge';
import {TlvError} from './TlvError';
import {TlvTag} from './TlvTag';

/**
 * String TLV object
 */
export class StringTag extends TlvTag {

    private readonly value: string;

    constructor(tlvTag: TlvTag) {
        const valueBytes: Uint8Array = tlvTag.getValueBytes();
        if (valueBytes.length < 2) {
            throw new TlvError(`Invalid null terminated string length: ${valueBytes.length}`);
        }

        if (valueBytes[valueBytes.length - 1] !== 0) {
            throw new TlvError('String must be null terminated');
        }

        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes);
        this.value = util.text.utf8.decode(valueBytes.slice(0, valueBytes.length - 1));
        Object.freeze(this);
    }

    public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string): StringTag {
        return new StringTag(new TlvTag(id, nonCriticalFlag, forwardFlag, util.text.utf8.encode(`${value}\0`)));
    }

    public getValue(): string {
        return this.value;
    }

    public toString(): string {
        let result: string = `TLV[0x${this.id.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ',N';
        }

        if (this.forwardFlag) {
            result += ',F';
        }

        result += ']:';

        result += `"${this.value}"`;

        return result;
    }
}
