/**
 * TLV objects base class
 */
export class TlvTag {
    public readonly id: number;
    public readonly tlv16BitFlag: boolean;
    public readonly nonCriticalFlag: boolean;
    public readonly forwardFlag: boolean;
    public readonly getValueBytes: () => Uint8Array;

    constructor(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, valueBytes: Uint8Array, tlv16BitFlag: boolean = false) {
        this.id = id;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytesCopy: Uint8Array = new Uint8Array(valueBytes);
        this.getValueBytes = (): Uint8Array => new Uint8Array(valueBytesCopy);
        this.tlv16BitFlag = tlv16BitFlag;

        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }
}
