import { IExtendingServiceProtocol } from '../../common/service/IExtendingServiceProtocol';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from './KsiHttpProtocol';
/**
 * HTTP extending service protocol
 */
export declare class ExtendingServiceProtocol extends KsiHttpProtocol implements IExtendingServiceProtocol {
    constructor(url: string);
    extend(requestBytes: Uint8Array): KsiRequestBase;
}
