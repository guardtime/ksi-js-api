export default class TlvTag {
    public readonly type: number;
    public readonly nonCriticalFlag: boolean;
    public readonly forwardFlag: boolean;
    public readonly valueBytes: Uint8Array;

    constructor(type: number, nonCriticalFlag: boolean, forwardFlag: boolean, bytes: Uint8Array) {
        this.type = type;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        this.valueBytes = bytes;
    }
}
