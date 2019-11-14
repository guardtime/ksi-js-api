import { UnsignedLongCoder } from 'gt-js-common';
import { TlvTag } from './TlvTag';
/**
 * Long TLV object
 */
export class IntegerTag extends TlvTag {
    constructor(tlvTag) {
        const bytes = tlvTag.getValueBytes();
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes, tlvTag.tlv16BitFlag);
        this.value = UnsignedLongCoder.decode(bytes, 0, bytes.length);
        Object.freeze(this);
    }
    static CREATE(id, nonCriticalFlag, forwardFlag, value) {
        return new IntegerTag(new TlvTag(id, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(value)));
    }
    getValue() {
        return this.value;
    }
    toString() {
        let result = `TLV[0x${this.id.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ',N';
        }
        if (this.forwardFlag) {
            result += ',F';
        }
        result += `]:i${this.value}`;
        return result;
    }
}
