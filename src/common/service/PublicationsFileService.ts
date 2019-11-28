import {PublicationsFile} from '../publication/PublicationsFile';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {IPublicationsFileServiceProtocol} from './IPublicationsFileServiceProtocol';
/**
 * Publications file service
 */
export class PublicationsFileService {
    private publicationsFileServiceProtocol: IPublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(publicationsFileServiceProtocol: IPublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
        this.publicationsFileFactory = publicationsFileFactory;
    }

    public async getPublicationsFile(): Promise<PublicationsFile> {
        return this.publicationsFileFactory.create(await this.publicationsFileServiceProtocol.getPublicationsFile());
    }
}
