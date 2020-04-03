/**
 * Aggregation Response PDU tests
 */
import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { ExtendRequestPdu } from '../../src/common/service/ExtendRequestPdu';

describe('ExtendRequestPdu', () => {
  it('Extender request must contain HMAC', () => {
    const requestBytes = Base64Coder.decode('gyAAIgEHAQVhbm9uAAIXAQeWMUquo2UeAgUVgQNCMwMFFYEDQjM=');

    expect(() => {
      return new ExtendRequestPdu(new TlvInputStream(requestBytes).readTag());
    }).toThrow('Exactly one MAC must exist in PDU.');
  });
});
