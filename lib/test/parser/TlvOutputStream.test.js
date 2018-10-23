import { RawTag } from '../../src/parser/RawTag';
import { TlvError } from '../../src/parser/TlvError';
import { TlvOutputStream } from '../../src/parser/TlvOutputStream';
import { TlvTag } from '../../src/parser/TlvTag';
/**
 * TlvOutputStream tests
 */
describe('TlvOutputStream', () => {
    it('Write valid TLV ', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(1, false, false, new Uint8Array(3));
        stream.writeTag(tlvTag);
        expect(stream.getData()).toMatchObject(new Uint8Array([0x1, 0x3, 0x0, 0x0, 0x0]));
    });
    it('Write valid TLV with flags ', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(1, true, true, new Uint8Array(3));
        stream.writeTag(tlvTag);
        expect(stream.getData()).toMatchObject(new Uint8Array([0x61, 0x3, 0x0, 0x0, 0x0]));
    });
    it('Write valid forced 16bit TLV', () => {
        const stream = new TlvOutputStream();
        const tlvTag = new TlvTag(0x1, false, false, new Uint8Array(3), true);
        stream.writeTag(tlvTag);
        expect(stream.getData()).toMatchObject(new Uint8Array([0x80, 0x1, 0x0, 0x3, 0x0, 0x0, 0x0]));
    });
    it('Write valid 16bit TLV with large id', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(0x20, false, false, new Uint8Array(3));
        stream.writeTag(tlvTag);
        expect(stream.getData()).toMatchObject(new Uint8Array([0x80, 0x20, 0x0, 0x3, 0x0, 0x0, 0x0]));
    });
    it('Write valid 16bit TLV with large data', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(0x1, false, false, new Uint8Array(256));
        stream.writeTag(tlvTag);
        const bytes = new Uint8Array(260);
        bytes.set([0x80, 0x1, 0x1, 0x0]);
        expect(stream.getData()).toMatchObject(new Uint8Array(bytes));
    });
    it('Fail to write too large id', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(0x2000, false, false, new Uint8Array(3));
        expect(() => {
            stream.writeTag(tlvTag);
        }).toThrow(TlvError);
    });
    it('Fail to write too large data', () => {
        const stream = new TlvOutputStream();
        const tlvTag = RawTag.CREATE(0x1, false, false, new Uint8Array(0x10000));
        expect(() => {
            stream.writeTag(tlvTag);
        }).toThrow(TlvError);
    });
});
