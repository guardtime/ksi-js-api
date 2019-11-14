/**
 * TLV objects base class
 */
export declare class TlvTag {
    readonly id: number;
    readonly tlv16BitFlag: boolean;
    readonly nonCriticalFlag: boolean;
    readonly forwardFlag: boolean;
    readonly getValueBytes: () => Uint8Array;
    constructor(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, valueBytes: Uint8Array, tlv16BitFlag?: boolean);
    static EQUALS(x: any, y: any): boolean;
    encode(): Uint8Array;
    equals(tag: any): boolean;
}
