import {TlvError} from '../../src/parser/TlvError';

/**
 * TlvError tests
 */
describe('TlvError', () => {
    it('Creation', () => {
        const tlvError: TlvError = new TlvError('Tlv Error');
        expect(tlvError.name).toEqual('TlvError');
        expect(tlvError.message).toEqual('Tlv Error');
        expect(() => { throw tlvError; }).toThrow(TlvError);
    });
});
