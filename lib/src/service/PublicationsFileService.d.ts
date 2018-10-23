import { IPublicationsFile } from '../publication/IPublicationsFile';
import { PublicationsFileFactory } from '../publication/PublicationsFileFactory';
import { PublicationsFileServiceProtocol } from './PublicationsFileServiceProtocol';
/**
 * Publications file service
 */
export declare class PublicationsFileService {
    private publicationsFileServiceProtocol;
    private publicationsFileFactory;
    constructor(publicationsFileServiceProtocol: PublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory);
    getPublicationsFile(): Promise<IPublicationsFile>;
}
