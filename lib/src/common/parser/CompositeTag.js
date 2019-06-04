import { tabPrefix } from 'gt-js-common';
import { TlvError } from './TlvError';
import { TlvInputStream } from './TlvInputStream';
import { TlvOutputStream } from './TlvOutputStream';
import { TlvTag } from './TlvTag';
/**
 * Counter for elements in composite TLV
 */
class ElementCounter {
    constructor() {
        this.counts = {};
    }
    getCount(id) {
        return this.counts[id] || 0;
    }
    addCount(id) {
        if (!this.counts.hasOwnProperty(id)) {
            this.counts[id] = 0;
        }
        this.counts[id] += 1;
    }
}
/**
 * Composite TLV object
 */
export class CompositeTag extends TlvTag {
    constructor(tlvTag) {
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
        this.value = [];
        this.elementCounter = new ElementCounter();
    }
    static CREATE_FROM_LIST(id, nonCriticalFlag, forwardFlag, value, tlv16BitFlag = false) {
        const stream = new TlvOutputStream();
        for (const tlvTag of value) {
            stream.writeTag(tlvTag);
        }
        return new TlvTag(id, nonCriticalFlag, forwardFlag, stream.getData(), tlv16BitFlag);
    }
    static createFromCompositeTag(id, tlvTag) {
        return new TlvTag(id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
    }
    static parseTlvTag(tlvTag) {
        if (!tlvTag.nonCriticalFlag) {
            throw new TlvError(`Unknown TLV tag: 0x${tlvTag.id.toString(16)}`);
        }
        return tlvTag;
    }
    toString() {
        let result = `TLV[0x${this.id.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ',N';
        }
        if (this.forwardFlag) {
            result += ',F';
        }
        result += ']:\n';
        for (let i = 0; i < this.value.length; i += 1) {
            result += tabPrefix(this.value[i].toString());
            if (i < (this.value.length - 1)) {
                result += '\n';
            }
        }
        return result;
    }
    decodeValue(createFunc) {
        const valueBytes = this.getValueBytes();
        const stream = new TlvInputStream(valueBytes);
        let position = 0;
        while (stream.getPosition() < stream.getLength()) {
            const tlvTag = createFunc(stream.readTag(), position);
            this.value.push(tlvTag);
            this.elementCounter.addCount(tlvTag.id);
            position += 1;
        }
        Object.freeze(this.elementCounter);
    }
    validateValue(validate) {
        validate(this.elementCounter);
    }
}
