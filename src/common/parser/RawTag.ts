import {HexCoder} from 'gt-js-common';
import {TlvTag} from './TlvTag';

/**
 * Byte array TLV object
 */
export class RawTag extends TlvTag {

    public getValue: () => Uint8Array;

    constructor(tlvTag: TlvTag) {
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
        this.getValue = (): Uint8Array => tlvTag.getValueBytes();
        Object.freeze(this);
    }

    public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag {
        return new RawTag(new TlvTag(id, nonCriticalFlag, forwardFlag, value));
    }

    public toString(): string {
        let result: string = `TLV[0x${this.id.toString(16)}`;
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