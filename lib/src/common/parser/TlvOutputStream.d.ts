import { ITlvTag } from './ITlvTag';
/**
 * Specialized output stream for encoding TLV data from TLVTag classes
 */
export declare class TlvOutputStream {
    private data;
    constructor();
    getData(): Uint8Array;
    writeTag(tlvTag: ITlvTag): void;
    write(data: Uint8Array): void;
}
