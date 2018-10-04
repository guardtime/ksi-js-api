/**
 * TLV objects base class
 */
export class TlvTag {
    public readonly id: number;
    public readonly nonCriticalFlag: boolean;
    public readonly forwardFlag: boolean;
    public readonly getValueBytes: () => Uint8Array;

    constructor(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, bytes: Uint8Array) {
        this.id = id;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytes: Uint8Array = new Uint8Array(bytes);
        this.getValueBytes = (): Uint8Array => new Uint8Array(valueBytes);
        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }
}
