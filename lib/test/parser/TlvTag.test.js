import { TlvTag } from '../../src/parser/TlvTag';
/**
 * TlvTag tests
 */
describe('TlvTag', () => {
    it('Creation', () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(tlvTag.id).toEqual(0x1);
        expect(tlvTag.nonCriticalFlag).toBeTruthy();
        expect(tlvTag.forwardFlag).toBeTruthy();
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
        expect(tlvTag.tlv16BitFlag).toBeFalsy();
    });
    it('Variables cannot be changed', () => {
        const bytes = new Uint8Array([0x1, 0x2]);
        const tlvTag = new TlvTag(0x1, true, true, bytes);
        expect(tlvTag.id).toEqual(0x1);
        // @ts-ignore
        expect(() => { tlvTag.id = 1; }).toThrow(TypeError);
        expect(tlvTag.nonCriticalFlag).toBeTruthy();
        // @ts-ignore
        expect(() => { tlvTag.nonCriticalFlag = false; }).toThrow(TypeError);
        expect(tlvTag.forwardFlag).toBeTruthy();
        // @ts-ignore
        expect(() => { tlvTag.forwardFlag = false; }).toThrow(TypeError);
        bytes.set([0x3, 0x4]);
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
        tlvTag.getValueBytes().set([0x3, 0x4]);
        expect(tlvTag.getValueBytes()).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
});
