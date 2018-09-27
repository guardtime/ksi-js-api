import * as BigInteger from "big-integer";
import {UnsignedLongCoder} from "gt-js-common";
import TlvTag from "./TlvTag";

export default class IntegerTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: number) {
        return new IntegerTag(
            new TlvTag(type, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(BigInteger(value))));
    }

    public value: BigInteger.BigInteger;

    constructor(tlvTag: TlvTag) {
        const bytes = tlvTag.getValueBytes();
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes);
        this.value = UnsignedLongCoder.decode(bytes, 0, bytes.length);
        Object.freeze(this);
    }

    public getValue(): BigInteger.BigInteger {
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

        result += `i${this.value}`;
        return result;
    }
}
