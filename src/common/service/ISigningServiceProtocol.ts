import {KsiRequestBase} from './KsiRequestBase';

/**
 * Signing service protocol interface
 */
export interface ISigningServiceProtocol {
    sign(requestBytes: Uint8Array): KsiRequestBase;
}

export function isSigningServiceProtocol(object: any): object is ISigningServiceProtocol {
    return 'sign' in object && typeof object.sign === 'function';
}
