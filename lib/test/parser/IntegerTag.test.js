import bigInteger from 'big-integer';
import { IntegerTag } from '../../src/common/parser/IntegerTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
/**
 * IntegerTag tests
 */
describe('IntegerTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x61, 0xA8]));
        const objectTag = new IntegerTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(bigInteger(25000));
    });
    it('Creation with CREATE', () => {
        const objectTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(bigInteger(25000));
    });
    it('toString output', () => {
        let objectTag = IntegerTag.CREATE(0x1, true, true, bigInteger(25000));
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:i25000');
        objectTag = IntegerTag.CREATE(0x20, false, false, bigInteger(25000));
        expect(objectTag.toString()).toEqual('TLV[0x20]:i25000');
    });
    it('Value cannot be changed', () => {
        const objectTag = IntegerTag.CREATE(0x1, false, false, bigInteger(25000));
        // @ts-ignore
        expect(() => { objectTag.value = 5000; }).toThrow(TypeError);
    });
});
