import {KsiRequestBase} from './KsiRequestBase';

/**
 * Extending service protocol interface
 */
export interface IExtendingServiceProtocol {
    extend(requestBytes: Uint8Array): KsiRequestBase;
}
