import TlvTag from "../../src/parser/TlvTag";

describe("TlvTag Test", () => {
    it("TlvTag creation", () => {
        const tlvTag = new TlvTag(0x1, true, true, new Uint8Array([0x1, 0x2]));
        expect(tlvTag.type).toEqual(0x1);
        expect(tlvTag.nonCriticalFlag).toBeTruthy();
        expect(tlvTag.forwardFlag).toBeTruthy();
        expect(tlvTag.valueBytes).toMatchObject(new Uint8Array([0x1, 0x2]));
    });
});
