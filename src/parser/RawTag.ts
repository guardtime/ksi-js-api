import {HexCoder} from "gt-js-common";
import TlvTag from "./TlvTag";

export default class RawTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag {
        return new RawTag(new TlvTag(type, nonCriticalFlag, forwardFlag, value));
    }

    public getValue: () => Uint8Array;

    constructor(tlvTag: TlvTag) {
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
        this.getValue = () => tlvTag.getValueBytes();
        Object.freeze(this);
    }

    public toString(): string {
        let result = `TLV[0x${this.type.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ",N";
        }

        if (this.forwardFlag) {
            result += ",F";
        }

        result += "]:";

        result += HexCoder.encode(this.getValue());
        return result;
    }
}
