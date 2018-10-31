import { KsiRequestBase } from './KsiRequestBase';
/**
 * Signing service protocol interface
 */
export interface ISigningServiceProtocol {
    sign(requestBytes: Uint8Array): KsiRequestBase;
}
