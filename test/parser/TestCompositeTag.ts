import { CERTIFICATE_RECORD_CONSTANTS } from '../../src/common/Constants';
import { CompositeTag } from '../../src/common/parser/CompositeTag';
import { RawTag } from '../../src/common/parser/RawTag';
import { TlvTag } from '../../src/common/parser/TlvTag';

/**
 * Test Composite TLV object
 */
export class TestCompositeTag extends CompositeTag {
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
