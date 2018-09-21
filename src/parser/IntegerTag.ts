import {BigInteger} from "big-integer";
import {UnsignedLongCoder} from "gt-js-common";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class IntegerTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: BigInteger) {
        return new IntegerTag(new TlvTag(type, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(value)));
    }

    public value: BigInteger;

    constructor(tlvTag: TlvTag) {
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.valueBytes);
        this.value = UnsignedLongCoder.decode(tlvTag.valueBytes, 0, tlvTag.valueBytes.length);
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

        result += `i${this.value}`;
        return result;
    }
}
