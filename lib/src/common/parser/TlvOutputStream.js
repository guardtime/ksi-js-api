import { isTlvTag } from './ITlvTag';
import { TlvError } from './TlvError';
/**
 * Specialized output stream for encoding TLV data from TLVTag classes
 */
export class TlvOutputStream {
    constructor() {
        this.data = new Uint8Array(0);
    }
    getData() {
        return new Uint8Array(this.data);
    }
    writeTag(tlvTag) {
        if (!(isTlvTag(tlvTag))) {
            throw new TlvError(`Invalid tlvTag: ${tlvTag}`);
        }
        this.write(tlvTag.encode());
    }
    write(data) {
        if (!(data instanceof Uint8Array)) {
            throw new TlvError(`Invalid data: ${data}`);
        }
        const combinedData = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }
}
