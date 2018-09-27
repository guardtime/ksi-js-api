import {tabPrefix} from "gt-js-common";
import TlvError from "./TlvError";
import TlvInputStream from "./TlvInputStream";
import TlvOutputStream from "./TlvOutputStream";
import TlvTag from "./TlvTag";

interface ITlvCount {
    [key: number]: number;
}

export default abstract class CompositeTag extends TlvTag {

    protected static createTlvTag(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: TlvTag[]) {
        const stream = new TlvOutputStream();
        for (const tlvTag of value) {
            stream.writeTag(tlvTag);
        }

        return new TlvTag(type, nonCriticalFlag, forwardFlag, stream.getData());
    }

    public value: TlvTag[];
    private readonly tlvCount: ITlvCount;

    constructor(tlvTag: TlvTag) {
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
        this.value = [];
    }

    public toString() {
        let result = `TLV[0x${this.type.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ",N";
        }

        if (this.forwardFlag) {
            result += ",F";
        }

        result += "]:\n";

        for (let i = 0; i < this.value.length; i++) {
            result += tabPrefix(this.value[i].toString());
            if (i < (this.value.length - 1)) {
                result += "\n";
            }
        }

        return result;
    }

    protected decodeValue(createElement: (tlvTag: TlvTag) => TlvTag) {
        const valueBytes = this.getValueBytes();
        const stream = new TlvInputStream(valueBytes);
        let tlvTag: TlvTag | undefined;
        try {
            while (stream.getPosition() < stream.getLength()) {
                tlvTag = stream.readTag();
                this.value.push(createElement(tlvTag));

                if (!this.tlvCount.hasOwnProperty(tlvTag.type)) {
                    this.tlvCount[tlvTag.type] = 0;
                }

                this.tlvCount[tlvTag.type]++;
            }
        } catch (err) {
            if (tlvTag !== undefined) {
                err += `_0x${tlvTag.type.toString(16)}`;
            }

            throw err;
        }
    }
}
