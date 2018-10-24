import {StringTag} from '../../src/common/parser/StringTag';
import {TlvError} from '../../src/common/parser/TlvError';
import {TlvTag} from '../../src/common/parser/TlvTag';

/**
 * StringTag tests
 */
describe('StringTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array(
            [0xE7, 0x88, 0xB1, 0xE6, 0xB2, 0x99, 0xE5, 0xB0, 0xBC, 0xE4, 0xBA, 0x9A, 0x00]));
        const objectTag: StringTag = new StringTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual('爱沙尼亚');
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
        expect(() => { return new StringTag(tlvTag); }).toThrow(TlvError);
    });

    it('Fail creation with not null terminated string', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54]));
        expect(() => { return new StringTag(tlvTag); }).toThrow(TlvError);
    });
});
