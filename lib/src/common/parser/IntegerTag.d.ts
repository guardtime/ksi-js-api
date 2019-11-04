import bigInteger, { BigInteger } from 'big-integer';
import { TlvTag } from './TlvTag';
/**
 * Long TLV object
 */
export declare class IntegerTag extends TlvTag {
    private readonly value;
    constructor(tlvTag: TlvTag);
    static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: BigInteger): IntegerTag;
    getValue(): bigInteger.BigInteger;
    toString(): string;
}
