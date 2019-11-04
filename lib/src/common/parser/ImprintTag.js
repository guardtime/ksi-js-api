import { DataHash } from '@guardtime/gt-js-common';
import { TlvTag } from './TlvTag';
/**
 * DataHash TLV object
 */
export class ImprintTag extends TlvTag {
    constructor(tlvTag) {
        const valueBytes = tlvTag.getValueBytes();
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
        this.value = new DataHash(valueBytes);
        Object.freeze(this);
    }
    static CREATE(id, nonCriticalFlag, forwardFlag, value) {
        return new ImprintTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value.imprint));
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
        result += `]:${this.value.toString()}`;
        return result;
    }
}
