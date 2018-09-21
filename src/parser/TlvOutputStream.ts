import {TlvStreamConstants} from "../Constants";
import TlvError from "./TlvError";
import TlvTag from "./TlvTag";

export default class TlvOutputStream {
    private data: Uint8Array;

    constructor() {
        this.data = new Uint8Array(0);
    }

    public getData(): Uint8Array {
        return new Uint8Array(this.data);
    }

    public writeTag(tlvTag: TlvTag) {
        if (tlvTag.type > TlvStreamConstants.MaxType) {
            throw new TlvError("Could not write TlvTag: Type is larger than max type");
        }

        if (tlvTag.valueBytes.length > 0xFFFF) {
            throw new TlvError("Could not write TlvTag: Data length is too large");
        }

        const tlv16BitFlag = tlvTag.type > TlvStreamConstants.TypeMask || tlvTag.valueBytes.length > 0XFF;
        let firstByte = ((tlv16BitFlag || TlvStreamConstants.Tlv16BitFlagBit) as number)
            + ((tlvTag.nonCriticalFlag || TlvStreamConstants.NonCriticalFlagBit) as number)
            + ((tlvTag.forwardFlag || TlvStreamConstants.ForwardFlagBit) as number);

        if (tlv16BitFlag) {
            firstByte |= (tlvTag.type >> 8) & TlvStreamConstants.TypeMask;
            this.write(new Uint8Array([
                firstByte & 0xFF,
                tlvTag.type & 0xFF,
                (tlvTag.valueBytes.length >> 8) & 0xFF,
                tlvTag.valueBytes.length & 0xFF,
            ]));
        } else {
            firstByte |= (tlvTag.type & TlvStreamConstants.TypeMask);
            this.write(new Uint8Array([firstByte, tlvTag.valueBytes.length & 0xFF]));
        }

        this.write(tlvTag.valueBytes);
    }

    private write(data: Uint8Array) {
        const combinedData = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }

}
