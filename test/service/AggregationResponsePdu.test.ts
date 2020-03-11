/**
 * Aggregation Response PDU tests
 */
import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { AggregationResponsePdu } from '../../src/common/service/AggregationResponsePdu';
import { ErrorPayload } from '../../src/common/service/ErrorPayload';

describe('AggregationResponsePdu', () => {
  it('Test with error pdu', () => {
    const responseBytes = Base64Coder.decode(
      'giEAjAERAQVhbm9uAAIEWASCWAMCoMgCMAEIdmHr5rYQpL0EAgEHBSB0aGlzLWVycm9yLXNob3VsZC1OT1QtYmUtdGhyb3duAAMiBAIBAQUcdGhpcy1lcnJvci1zaG91bGQtYmUtdGhyb3duAB8hAdW8P1RNQwTEXHJDwVLjdIY+gbkN2MeQwv8uCMatmn4g'
    );
    const responsePdu = new AggregationResponsePdu(new TlvInputStream(responseBytes).readTag());

    expect((responsePdu.getErrorPayload() as ErrorPayload).getErrorMessage()).toEqual('this-error-should-be-thrown');
  });
});
