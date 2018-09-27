export default class TlvTag {
    public readonly type: number;
    public readonly nonCriticalFlag: boolean;
    public readonly forwardFlag: boolean;
    public readonly getValueBytes: () => Uint8Array;

    constructor(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, bytes: Uint8Array) {
        this.type = type;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytes = new Uint8Array(bytes);
        this.getValueBytes = () => new Uint8Array(valueBytes);
        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }
}
