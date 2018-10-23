import { TlvTag } from './TlvTag';
/**
 * Byte array TLV object
 */
export declare class RawTag extends TlvTag {
    getValue: () => Uint8Array;
    constructor(tlvTag: TlvTag);
    static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: Uint8Array): RawTag;
    toString(): string;
}
