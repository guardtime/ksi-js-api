import {HexCoder} from "gt-js-common";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class RawTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array) {
        return new RawTag(new TlvTag(type, nonCriticalFlag, forwardFlag, value));
    }

    public value: Uint8Array;

    constructor(tlvTag: TlvTag) {
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.valueBytes);
        this.value = new Uint8Array(tlvTag.valueBytes);
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

        result += HexCoder.encode(this.value);
        return result;
    }
}
