import { TlvTag } from './TlvTag';
/**
 * String TLV object
 */
export declare class StringTag extends TlvTag {
    private readonly value;
    constructor(tlvTag: TlvTag);
    static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: string): StringTag;
    getValue(): string;
    toString(): string;
}
