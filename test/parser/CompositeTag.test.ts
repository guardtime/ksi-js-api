import {CERTIFICATE_RECORD_CONSTANTS} from '../../src/common/Constants';
import {CompositeTag} from '../../src/common/parser/CompositeTag';
import {RawTag} from '../../src/common/parser/RawTag';
import {TlvError} from '../../src/common/parser/TlvError';
import {TlvTag} from '../../src/common/parser/TlvTag';

/**
 * CompositeTag tests
 */
describe('CompositeTag', () => {
    it('Encode with non critical unknown tag', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, true, false, new Uint8Array([3, 4])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([5, 6]))
        ]);

        console.log(tlvTag.encode());
        const compositeTag: TestCompositeTag = new TestCompositeTag(tlvTag);
        expect(compositeTag.encode()).toEqual(new Uint8Array([135, 2, 0, 12, 1, 2, 1, 2, 66, 2, 3, 4, 1, 2, 5, 6]));
    });

    it('Creation with unknown child tag', () => {
        const tlvTag: TlvTag = CompositeTag.CREATE_FROM_LIST(CERTIFICATE_RECORD_CONSTANTS.TagType, false, false, [
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType, false, false, new Uint8Array([1, 2])),
            RawTag.CREATE(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType, false, false, new Uint8Array([3, 4]))
        ]);

        expect(() => {
            return new TestCompositeTag(tlvTag);
        }).toThrow(TlvError);
    });
});

/**
 * Test Composite TLV object
 */
class TestCompositeTag extends CompositeTag {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
    }

    // noinspection JSMethodCanBeStatic
    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
                return new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

}
