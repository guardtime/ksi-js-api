import { DataHash, HashAlgorithm } from 'gt-js-common';
import { ImprintTag } from '../../src/common/parser/ImprintTag';
import { TlvTag } from '../../src/common/parser/TlvTag';
/**
 * ImprintTag tests
 */
describe('ImprintTag', () => {
    it('Creation from tlvTag', () => {
        const valueBytes = new Uint8Array(33);
        valueBytes.set([0x1]);
        const tlvTag = new TlvTag(0x1, true, true, valueBytes);
        const objectTag = new ImprintTag(tlvTag);
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    });
    it('Creation with CREATE', () => {
        const objectTag = ImprintTag.CREATE(0x1, true, true, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
        expect(objectTag.id).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
    });
    it('toString output', () => {
        let objectTag = ImprintTag.CREATE(0x1, true, true, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
        expect(objectTag.toString())
            .toEqual('TLV[0x1,N,F]:010000000000000000000000000000000000000000000000000000000000000000');
        objectTag = ImprintTag.CREATE(0x20, false, false, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
        expect(objectTag.toString())
            .toEqual('TLV[0x20]:010000000000000000000000000000000000000000000000000000000000000000');
    });
    it('Value cannot be changed', () => {
        const objectTag = ImprintTag.CREATE(0x1, true, true, DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32)));
        expect(() => {
            // @ts-ignore
            objectTag.value = DataHash.create(HashAlgorithm.SHA2_256, new Uint8Array(32));
        }).toThrow(TypeError);
    });
});
