import {TLV_CONSTANTS} from '../Constants';
import {TlvError} from './TlvError';
import {TlvTag} from './TlvTag';

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

    public writeTag(tlvTag: TlvTag): void {
        if (tlvTag.id > TLV_CONSTANTS.MaxType) {
            throw new TlvError('Could not write TlvTag: Type is larger than max id');
        }

        const valueBytes: Uint8Array = tlvTag.getValueBytes();
        if (valueBytes.length > 0xFFFF) {
            throw new TlvError('Could not write TlvTag: Data length is too large');
        }

        const tlv16BitFlag: boolean = tlvTag.id > TLV_CONSTANTS.TypeMask || valueBytes.length > 0xFF || tlvTag.tlv16BitFlag;
        let firstByte: number = (<number>(tlv16BitFlag && TLV_CONSTANTS.Tlv16BitFlagBit))
            + (<number>(tlvTag.nonCriticalFlag && TLV_CONSTANTS.NonCriticalFlagBit))
            + (<number>(tlvTag.forwardFlag && TLV_CONSTANTS.ForwardFlagBit));

        if (tlv16BitFlag) {
            firstByte |= (tlvTag.id >> 8) & TLV_CONSTANTS.TypeMask;
            this.write(new Uint8Array([
                firstByte & 0xFF,
                tlvTag.id & 0xFF,
                (valueBytes.length >> 8) & 0xFF,
                valueBytes.length & 0xFF
            ]));
        } else {
            firstByte |= (tlvTag.id & TLV_CONSTANTS.TypeMask);
            this.write(new Uint8Array([firstByte, valueBytes.length & 0xFF]));
        }

        this.write(valueBytes);
    }

    public write(data: Uint8Array): void {
        const combinedData: Uint8Array = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    }

}
