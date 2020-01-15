import { ISigningServiceProtocol } from '../../common/service/ISigningServiceProtocol';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from './KsiHttpProtocol';
/**
 * HTTP signing service protocol
 */
export declare class SigningServiceProtocol extends KsiHttpProtocol implements ISigningServiceProtocol {
    constructor(url: string);
    sign(requestBytes: Uint8Array): KsiRequestBase;
}
