import { KsiRequestBase } from './KsiRequestBase';
/**
 * Signing service protocol interface
 */
export interface ISigningServiceProtocol {
    sign(requestBytes: Uint8Array): KsiRequestBase;
}
export declare function isSigningServiceProtocol(object: any): object is ISigningServiceProtocol;
