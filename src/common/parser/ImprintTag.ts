import {DataHash} from 'gt-js-common';
import {TlvTag} from './TlvTag';

/**
 * DataHash TLV object
 */
export class ImprintTag extends TlvTag {

    private readonly value: DataHash;

    constructor(tlvTag: TlvTag) {
        const valueBytes: Uint8Array = tlvTag.getValueBytes();
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes, tlvTag.tlv16BitFlag);
        this.value = new DataHash(valueBytes);
        Object.freeze(this);
    }

    public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: DataHash): ImprintTag {
        return new ImprintTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value.imprint));
    }

    public getValue(): DataHash {
        return this.value;
    }

    public toString(): string {
        let result: string = `TLV[0x${this.id.toString(16)}`;
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
