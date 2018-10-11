import {HexCoder} from 'gt-js-common';
import {TlvError} from '../../src/parser/TlvError';
import {TlvInputStream} from '../../src/parser/TlvInputStream';
import {TlvTag} from '../../src/parser/TlvTag';

/**
 * TlvInputStream tests
 */
describe('TlvInputStream', () => {
    it('Read valid TLV ', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('010101'));
        const tlvTag: TlvTag = stream.readTag();
        expect(tlvTag.id).toEqual(0x1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
    });

    it('Read 16bit id TLV ', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('8001000101'));
        const tlvTag: TlvTag = stream.readTag();
        expect(tlvTag.id).toEqual(1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1]));
    });

    it('Read 16bit length TLV ', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`));
        const tlvTag: TlvTag = stream.readTag();
        expect(tlvTag.id).toEqual(1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        const valueBytes: Uint8Array = new Uint8Array(256);
        valueBytes.set([0x1]);
        expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
    });

    it('Read 16bit length TLV ', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`));
        const tlvTag: TlvTag = stream.readTag();
        expect(tlvTag.id).toEqual(1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        const valueBytes: Uint8Array = new Uint8Array(256);
        valueBytes.set([0x1]);
        expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
    });

    it('Read 16bit length TLV ', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode(`8001010001${HexCoder.encode(new Uint8Array(255))}`));
        const tlvTag: TlvTag = stream.readTag();
        expect(tlvTag.id).toEqual(1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        const valueBytes: Uint8Array = new Uint8Array(256);
        valueBytes.set([0x1]);
        expect(tlvTag.getValueBytes()).toMatchObject(valueBytes);
    });

    it('Read TLV with invalid length of data', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01030101'));
        expect(() => { stream.readTag(); }).toThrow(TlvError);
    });

    it('Read TLV with invalid length', () => {
        const stream: TlvInputStream = new TlvInputStream(HexCoder.decode('01'));
        expect(() => { stream.readTag(); }).toThrow(TlvError);
    });
});
