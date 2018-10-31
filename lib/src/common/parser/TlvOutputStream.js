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
        this.write(tlvTag.encode());
    }
    write(data) {
        const combinedData = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }
}
