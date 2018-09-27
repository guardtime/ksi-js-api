import * as BigInteger from "big-integer";
import IntegerTag from "../../src/parser/IntegerTag";
import TlvTag from "../../src/parser/TlvTag";

describe("IntegerTag", () => {
    it("Creation from tlvTag", () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x61, 0xa8]));
        const objectTag = new IntegerTag(tlvTag);
        expect(objectTag.type).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(BigInteger(25000));
    });

    it("Creation with create", () => {
        const objectTag = IntegerTag.create(0x1, true, true, 25000);
        expect(objectTag.type).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual(25);
    });

    it("toString output", () => {
        let objectTag = IntegerTag.create(0x1, true, true, 25000);
        expect(objectTag.toString()).toEqual("TLV[0x1,N,F]:i25000");
        objectTag = IntegerTag.create(0x20, false, false, 25000);
        expect(objectTag.toString()).toEqual("TLV[0x20]:i25000");
    });

    it("Value cannot be changed", () => {
        const objectTag = IntegerTag.create(0x1, false, false, 25000);
        // @ts-ignore
        expect(() => { objectTag.value = 5000; }).toThrow(TypeError);
    });
});
