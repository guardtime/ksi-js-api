import {DataHash} from "gt-js-common";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class ImprintTag extends TlvTag {

    public static create(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: DataHash) {
        return new ImprintTag(new TlvTag(type, nonCriticalFlag, forwardFlag, value.imprint));
    }

    public value: DataHash;

    constructor(tlvTag: TlvTag) {
        const valueBytes = tlvTag.getValueBytes();
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes);
        this.value = new DataHash(valueBytes);
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

        result += this.value.toString();
        return result;
    }
}
