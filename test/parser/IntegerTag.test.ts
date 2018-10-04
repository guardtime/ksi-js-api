import BigInteger from 'node_modules/big-integer/BigInteger';
import {IntegerTag} from 'src/parser/IntegerTag';
import {TlvTag} from 'src/parser/TlvTag';

/**
 * IntegerTag tests
 */
describe('IntegerTag', () => {
    it('Creation from tlvTag', () => {
        const tlvTag: TlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x61, 0xA8]));
        const objectTag: IntegerTag = new IntegerTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(BigInteger(25000));
    });

    it('Creation with CREATE', () => {
        const objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, 25000);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(BigInteger(25000));
    });

    it('toString output', () => {
        let objectTag: IntegerTag = IntegerTag.CREATE(0x1, true, true, 25000);
        expect(objectTag.toString()).toEqual('TLV[0x1,N,F]:i25000');
        objectTag = IntegerTag.CREATE(0x20, false, false, 25000);
        expect(objectTag.toString()).toEqual('TLV[0x20]:i25000');
    });

    it('Value cannot be changed', () => {
        const objectTag: IntegerTag = IntegerTag.CREATE(0x1, false, false, 25000);
        // @ts-ignore
        expect(() => { objectTag.value = 5000; }).toThrow(TypeError);
    });
});
