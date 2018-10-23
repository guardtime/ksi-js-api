import { RawTag } from '../../src/parser/RawTag';
import { TlvTag } from '../../src/parser/TlvTag';
/**
 * RawTag tests
 */
describe('RawTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
        const objectTag = new RawTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
    it('Creation with CREATE', () => {
        const objectTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
    it('toString output', () => {
        let objectTag = RawTag.CREATE(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:0102');
        objectTag = RawTag.CREATE(0x20, false, false, new Uint8Array([0x1, 0x2]));
        expect(objectTag.toString()).toEqual('TLV[0x20]:0102');
    });
    it('Value cannot be changed', () => {
        const bytes = new Uint8Array([0x1, 0x2]);
        const objectTag = RawTag.CREATE(0x1, false, false, bytes);
        bytes.set([0x3, 0x4]);
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
        objectTag.getValue().set([0x3, 0x4]);
        expect(objectTag.getValue()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
});
