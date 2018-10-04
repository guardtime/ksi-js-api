import {StringTag} from 'src/parser/StringTag';
import {TlvError} from 'src/parser/TlvError';
import {TlvTag} from 'src/parser/TlvTag';

/**
 * StringTag tests
 */
describe('StringTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54, 0x0]));
        const objectTag: StringTag = new StringTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual('TEST');
    });

    it('Creation with Create', () => {
        const objectTag: StringTag = StringTag.CREATE(0x1, true, true, 'TEST');
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual('TEST');
    });

    it('toString output', () => {
        let objectTag: StringTag = StringTag.CREATE(0x1, true, true, 'TEST');
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:"TEST"');
        objectTag = StringTag.CREATE(0x20, false, false, 'TEST');
        expect(objectTag.toString()).toEqual('TLV[0x20]:"TEST"');
    });

    it('Value cannot be changed', () => {
        const objectTag: StringTag = StringTag.CREATE(0x1, false, false, 'TEST');
        // @ts-ignore
        expect(() => { objectTag.value = 'FAIL'; }).toThrow(TypeError);
    });

    it('Fail creation with invalid string length', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x0]));
        expect(() => { const tag: StringTag = new StringTag(tlvTag); }).toThrow(TlvError);
    });

    it('Fail creation with not null terminated string', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54]));
        expect(() => { const tag: StringTag = new StringTag(tlvTag); }).toThrow(TlvError);
    });
});
