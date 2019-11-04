import { HexCoder } from '@guardtime/gt-js-common';
import { TlvTag } from './TlvTag';
/**
 * Byte array TLV object
 */
export class RawTag extends TlvTag {
    constructor(tlvTag) {
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
        this.getValue = () => tlvTag.getValueBytes();
        Object.freeze(this);
    }
    static CREATE(id, nonCriticalFlag, forwardFlag, value) {
        return new RawTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value));
    }
    toString() {
        let result = `TLV[0x${this.id.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ',N';
        }
        if (this.forwardFlag) {
            result += ',F';
        }
        result += `]:${HexCoder.encode(this.getValue())}`;
        return result;
    }
}
