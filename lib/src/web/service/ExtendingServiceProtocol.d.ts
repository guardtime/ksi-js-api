import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from './KsiHttpProtocol';
import { IExtendingServiceProtocol } from '../../common/service/IExtendingServiceProtocol';
/**
 * HTTP extending service protocol
 */
export declare class ExtendingServiceProtocol extends KsiHttpProtocol implements IExtendingServiceProtocol {
    constructor(url: string);
    extend(requestBytes: Uint8Array): KsiRequestBase;
}
