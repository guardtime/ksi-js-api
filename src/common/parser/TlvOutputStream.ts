import {isTlvTag, ITlvTag} from './ITlvTag';
import {TlvError} from './TlvError';

/**
 * Specialized output stream for encoding TLV data from TLVTag classes
 */
export class TlvOutputStream {
    private data: Uint8Array;

    constructor() {
        this.data = new Uint8Array(0);
    }

    public getData(): Uint8Array {
        return new Uint8Array(this.data);
    }

    public writeTag(tlvTag: ITlvTag): void {
        if (!(isTlvTag(tlvTag))) {
            throw new TlvError(`Invalid tlvTag: ${tlvTag}`);
        }

        this.write(tlvTag.encode());
    }

    public write(data: Uint8Array): void {
        if (!(data instanceof Uint8Array)) {
            throw new TlvError(`Invalid data: ${data}`);
        }

        const combinedData: Uint8Array = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }

}
