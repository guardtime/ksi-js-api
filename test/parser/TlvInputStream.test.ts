import {HexCoder} from "gt-js-common";
import TlvInputStream from "../../src/parser/TlvInputStream";

describe("TlvInputStream", () => {
    it("Read valid TLV ", () => {
        const stream = new TlvInputStream(HexCoder.decode("010101"));
        const tlvTag = stream.readTag();
        expect(tlvTag.type).toEqual(0x1);
        expect(tlvTag.nonCriticalFlag).toBeFalsy();
        expect(tlvTag.forwardFlag).toBeFalsy();
        expect(tlvTag.valueBytes).toMatchObject(new Uint8Array([0x1]));
    });
});
