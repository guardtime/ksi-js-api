import { IPublicationsFile } from '../publication/IPublicationsFile';
import { PublicationsFileFactory } from '../publication/PublicationsFileFactory';
import { IPublicationsFileServiceProtocol } from './IPublicationsFileServiceProtocol';
/**
 * Publications file service
 */
export declare class PublicationsFileService {
    private publicationsFileServiceProtocol;
    private publicationsFileFactory;
    constructor(publicationsFileServiceProtocol: IPublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory);
    getPublicationsFile(): Promise<IPublicationsFile>;
}
