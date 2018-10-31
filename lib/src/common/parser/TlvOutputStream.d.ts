import { TlvTag } from './TlvTag';
/**
 * Specialized output stream for encoding TLV data from TLVTag classes
 */
export declare class TlvOutputStream {
    private data;
    getData(): Uint8Array;
    writeTag(tlvTag: TlvTag): void;
    write(data: Uint8Array): void;
}
