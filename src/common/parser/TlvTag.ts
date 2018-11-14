import {TLV_CONSTANTS} from '../Constants';
import {TlvError} from './TlvError';
import {compareTypedArray} from '../util/Array';

/**
 * TLV objects base class
 */
export class TlvTag {
    public readonly id: number;
    public readonly tlv16BitFlag: boolean;
    public readonly nonCriticalFlag: boolean;
    public readonly forwardFlag: boolean;
    public readonly getValueBytes: () => Uint8Array;

    constructor(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, valueBytes: Uint8Array, tlv16BitFlag: boolean = false) {
        this.id = id;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        const valueBytesCopy: Uint8Array = new Uint8Array(valueBytes);
        this.getValueBytes = (): Uint8Array => new Uint8Array(valueBytesCopy);
        this.tlv16BitFlag = tlv16BitFlag;

        if (new.target === TlvTag) {
            Object.freeze(this);
        }
    }

    // tslint:disable-next-line:no-any
    public static EQUALS(x: any, y: any): boolean {
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
            || !compareTypedArray(x.getValueBytes(), y.getValueBytes()));
    }

    public encode(): Uint8Array {
        if (this.id > TLV_CONSTANTS.MaxType) {
            throw new TlvError('Could not write TlvTag: Type is larger than max id');
        }

        const valueBytes: Uint8Array = this.getValueBytes();
        if (valueBytes.length > 0xFFFF) {
            throw new TlvError('Could not write TlvTag: Data length is too large');
        }

        const tlv16BitFlag: boolean = this.id > TLV_CONSTANTS.TypeMask || valueBytes.length > 0xFF || this.tlv16BitFlag;
        let firstByte: number = (<number>(tlv16BitFlag && TLV_CONSTANTS.Tlv16BitFlagBit))
            + (<number>(this.nonCriticalFlag && TLV_CONSTANTS.NonCriticalFlagBit))
            + (<number>(this.forwardFlag && TLV_CONSTANTS.ForwardFlagBit));

        let result: Uint8Array;
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
        } else {
            firstByte |= (this.id & TLV_CONSTANTS.TypeMask);

            result = new Uint8Array(valueBytes.length + 2);
            result.set([firstByte, valueBytes.length & 0xFF]);
            result.set(valueBytes, 2);
        }

        return result;
    }

    // tslint:disable-next-line:no-any
    public equals(tag: any): boolean {
        return TlvTag.EQUALS(this, tag);
    }
}
