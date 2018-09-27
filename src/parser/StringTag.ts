import {ASCIIConverter} from "gt-js-common";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class StringTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string) {
        return new StringTag(new TlvTag(type, nonCriticalFlag, forwardFlag, ASCIIConverter.ToBytes(`${value}\0`)));
    }

    private value: string;

    constructor(tlvTag: TlvTag) {
        const valueBytes = tlvTag.getValueBytes();
        if (valueBytes.length < 2) {
            throw new TlvError(`Invalid null terminated string length: ${valueBytes.length}`);
        }

        if (valueBytes[valueBytes.length - 1] !== 0) {
            throw new TlvError("String must be null terminated");
        }

        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes);
        this.value = ASCIIConverter.ToString(valueBytes.slice(0, valueBytes.length - 1));
        Object.freeze(this);
    }

    public getValue() {
        return this.value;
    }

    public toString() {
        let result = `TLV[0x${this.type.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ",N";
        }

        if (this.forwardFlag) {
            result += ",F";
        }

        result += "]:";

        result += `"${this.value}"`;
        return result;
    }
}
