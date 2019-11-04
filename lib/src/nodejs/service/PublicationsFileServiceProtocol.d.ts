import { KsiHttpProtocol } from './KsiHttpProtocol';
/**
 * HTTP signing service protocol
 */
export declare class PublicationsFileServiceProtocol extends KsiHttpProtocol {
    constructor(url: string);
    getPublicationsFile(): Promise<Uint8Array>;
}
