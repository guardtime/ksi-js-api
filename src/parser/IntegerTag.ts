import BigInteger from 'node_modules/big-integer/BigInteger';
import {UnsignedLongCoder} from 'node_modules/gt-js-common/lib/main';
import {TlvTag} from 'src/parser/TlvTag';

/**
 * Long TLV object
 */
export class IntegerTag extends TlvTag {

    private readonly value: BigInteger.BigInteger;

    constructor(tlvTag: TlvTag) {
        const bytes: Uint8Array = tlvTag.getValueBytes();
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes);
        this.value = UnsignedLongCoder.decode(bytes, 0, bytes.length);
        Object.freeze(this);
    }

    public static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: number): IntegerTag {
        return new IntegerTag(
            new TlvTag(id, nonCriticalFlag, forwardFlag, UnsignedLongCoder.encode(BigInteger(value))));
    }

    public getValue(): BigInteger.BigInteger {
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
