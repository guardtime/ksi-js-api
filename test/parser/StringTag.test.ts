import StringTag from "../../src/parser/StringTag";
import TlvError from "../../src/parser/TlvError";
import TlvTag from "../../src/parser/TlvTag";

describe("StringTag", () => {
    it("Creation from tlvTag", () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54, 0x0]));
        const objectTag = new StringTag(tlvTag);
        expect(objectTag.type).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual("TEST");
    });

    it("Creation with create", () => {
        const objectTag = StringTag.create(0x1, true, true, "TEST");
        expect(objectTag.type).toEqual(0x1);
        expect(objectTag.nonCriticalFlag).toBeTruthy();
        expect(objectTag.forwardFlag).toBeTruthy();
        expect(objectTag.getValue()).toEqual("TEST");
    });

    it("toString output", () => {
        let objectTag = StringTag.create(0x1, true, true, "TEST");
        expect(objectTag.toString()).toEqual("TLV[0x1,N,F]:\"TEST\"");
        objectTag = StringTag.create(0x20, false, false, "TEST");
        expect(objectTag.toString()).toEqual("TLV[0x20]:\"TEST\"");
    });

    it("Value cannot be changed", () => {
        const objectTag = StringTag.create(0x1, false, false, "TEST");
        // @ts-ignore
        expect(() => { objectTag.value = "FAIL"; }).toThrow(TypeError);
    });

    it("Fail creation with invalid string length", () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x0]));
        expect(() => { const tag = new StringTag(tlvTag); }).toThrow(TlvError);
    });

    it("Fail creation with not null terminated string", () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x54, 0x45, 0x53, 0x54]));
        expect(() => { const tag = new StringTag(tlvTag); }).toThrow(TlvError);
    });
});
