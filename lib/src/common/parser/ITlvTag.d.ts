/**
 * TlvTag interface
 */
export interface ITlvTag {
    readonly id: number;
    readonly tlv16BitFlag: boolean;
    readonly nonCriticalFlag: boolean;
    readonly forwardFlag: boolean;
    getValueBytes(): Uint8Array;
    encode(): Uint8Array;
}
export declare function isTlvTag(object: any): object is ITlvTag;
