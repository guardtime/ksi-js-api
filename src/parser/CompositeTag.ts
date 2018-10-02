import {tabPrefix} from "gt-js-common";
import TlvError from "./TlvError";
import TlvInputStream from "./TlvInputStream";
import TlvOutputStream from "./TlvOutputStream";
import TlvTag from "./TlvTag";

export interface ITlvCount {
    [key: number]: number;
}

export default abstract class CompositeTag extends TlvTag {
    protected static createCompositeTagTlv(type: number, nonCriticalFlag: boolean, forwardFlag: boolean,
                                           value: TlvTag[]): TlvTag {
        const stream = new TlvOutputStream();
        for (const tlvTag of value) {
            stream.writeTag(tlvTag);
        }

        return new TlvTag(type, nonCriticalFlag, forwardFlag, stream.getData());
    }

    protected static parseTlvTag(tlvTag: TlvTag): TlvTag {
        if (!tlvTag.nonCriticalFlag) {
            throw new TlvError(`Unknown TLV tag: ${tlvTag.type.toString(16)}`);
        }

        return tlvTag;
    }

    public value: TlvTag[];
    private readonly tlvCount: ITlvCount;

    protected constructor(tlvTag: TlvTag) {
        super(tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
        this.value = [];
    }

    public toString(): string {
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

    protected decodeValue(create: (tlvTag: TlvTag, position: number) => TlvTag): void {
        const valueBytes = this.getValueBytes();
        const stream = new TlvInputStream(valueBytes);
        let position = 0;
        while (stream.getPosition() < stream.getLength()) {
            const tlvTag = create(stream.readTag(), position++);
            this.value.push(tlvTag);

            if (!this.tlvCount.hasOwnProperty(tlvTag.type)) {
                this.tlvCount[tlvTag.type] = 0;
            }

            this.tlvCount[tlvTag.type]++;
        }
    }

    protected validateValue(validate: (tlvCount: ITlvCount) => void): void {
        validate(Object.assign({}, this.tlvCount));
    }
}
