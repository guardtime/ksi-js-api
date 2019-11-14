import { TlvTag } from './TlvTag';
/**
 * Specialized input stream for decoding TLV data from bytes
 */
export declare class TlvInputStream {
    private readonly data;
    private position;
    private readonly length;
    constructor(bytes: Uint8Array);
    getPosition(): number;
    getLength(): number;
    readTag(): TlvTag;
    private readByte;
    private readShort;
    private read;
}
