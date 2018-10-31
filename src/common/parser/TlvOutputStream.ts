import {TlvTag} from './TlvTag';

/**
 * Specialized output stream for encoding TLV data from TLVTag classes
 */
export class TlvOutputStream {
    private data: Uint8Array = new Uint8Array(0);

    public getData(): Uint8Array {
        return new Uint8Array(this.data);
    }

    public writeTag(tlvTag: TlvTag): void {
        this.write(tlvTag.encode());
    }

    public write(data: Uint8Array): void {
        const combinedData: Uint8Array = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }

}
