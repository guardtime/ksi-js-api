import { ISigningServiceProtocol } from './ISigningServiceProtocol';
import { KsiRequestBase } from './KsiRequestBase';
/**
 * Extending service protocol interface
 */
export interface IExtendingServiceProtocol {
    extend(requestBytes: Uint8Array): KsiRequestBase;
}
export declare function isExtendingServiceProtocol(object: any): object is ISigningServiceProtocol;
