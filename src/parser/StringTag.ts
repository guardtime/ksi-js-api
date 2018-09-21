import {ASCIIConverter} from "gt-js-common";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class StringTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string) {
        return new StringTag(new TlvTag(type, nonCriticalFlag, forwardFlag, ASCIIConverter.ToBytes(`${value}\0`)));
    }

    public value: string;

    constructor(tlvTag: TlvTag) {
        if (tlvTag.valueBytes.length < 2) {
            throw new TlvError(`Invalid null terminated string length: ${tlvTag.valueBytes.length}`);
        }

        if (tlvTag.valueBytes[tlvTag.valueBytes.length - 1] !== 0) {
            throw new TlvError("String must be null terminated");
        }

        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.valueBytes);
        this.value = ASCIIConverter.ToString(tlvTag.valueBytes.slice(0, tlvTag.valueBytes.length - 1));
        Object.freeze(this);
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
