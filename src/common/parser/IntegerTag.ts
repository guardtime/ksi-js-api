import {UnsignedLongCoder} from '@guardtime/gt-js-common';
import bigInteger, {BigInteger} from 'big-integer';
import {TlvTag} from './TlvTag';

/**
 * Long TLV object
 */
export class IntegerTag extends TlvTag {

    private readonly value: bigInteger.BigInteger;

    constructor(tlvTag: TlvTag) {
        const bytes: Uint8Array = tlvTag.getValueBytes();
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes, tlvTag.tlv16BitFlag);
        this.value = UnsignedLongCoder.decode(bytes, 0, bytes.length);
        Object.freeze(this);
    }

    public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: BigInteger): IntegerTag {
        return new IntegerTag(
            new TlvTag(id, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(value)));
    }

    public getValue(): bigInteger.BigInteger {
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

        result += `]:i${this.value}`;

        return result;
    }
}
