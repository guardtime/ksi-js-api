import { TLV_CONSTANTS } from '../Constants';
import { TlvError } from './TlvError';
/**
 * TLV objects base class
 */
export class TlvTag {
    constructor(id, nonCriticalFlag, forwardFlag, valueBytes, tlv16BitFlag = false) {
        this.id = id;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytesCopy = new Uint8Array(valueBytes);
        this.getValueBytes = () => new Uint8Array(valueBytesCopy);
        this.tlv16BitFlag = tlv16BitFlag;
        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }
    // tslint:disable-next-line:no-any
    static EQUALS(x, y) {
        if (!(x instanceof TlvTag) || !(y instanceof TlvTag)) {
            return false;
        }
        if (x === y) {
            return true;
        }
        if (x.constructor.name !== y.constructor.name) {
            return false;
        }
        return !(x.id !== y.id
            || x.forwardFlag !== y.forwardFlag
            || x.nonCriticalFlag !== y.nonCriticalFlag
            || JSON.stringify(x.getValueBytes()) !== JSON.stringify(y.getValueBytes()));
    }
    encode() {
        if (this.id > TLV_CONSTANTS.MaxType) {
            throw new TlvError('Could not write TlvTag: Type is larger than max id');
        }
        const valueBytes = this.getValueBytes();
        if (valueBytes.length > 0xFFFF) {
            throw new TlvError('Could not write TlvTag: Data length is too large');
        }
        const tlv16BitFlag = this.id > TLV_CONSTANTS.TypeMask || valueBytes.length > 0xFF || this.tlv16BitFlag;
        let firstByte = (tlv16BitFlag && TLV_CONSTANTS.Tlv16BitFlagBit)
            + (this.nonCriticalFlag && TLV_CONSTANTS.NonCriticalFlagBit)
            + (this.forwardFlag && TLV_CONSTANTS.ForwardFlagBit);
        let result;
        if (tlv16BitFlag) {
            firstByte |= (this.id >> 8) & TLV_CONSTANTS.TypeMask;
            result = new Uint8Array(valueBytes.length + 4);
            result.set([
                firstByte & 0xFF,
                this.id & 0xFF,
                (valueBytes.length >> 8) & 0xFF,
                valueBytes.length & 0xFF
            ]);
            result.set(valueBytes, 4);
        }
        else {
            firstByte |= (this.id & TLV_CONSTANTS.TypeMask);
            result = new Uint8Array(valueBytes.length + 2);
            result.set([firstByte, valueBytes.length & 0xFF]);
            result.set(valueBytes, 2);
        }
        return result;
    }
    // tslint:disable-next-line:no-any
    equals(tag) {
        return TlvTag.EQUALS(this, tag);
    }
}
