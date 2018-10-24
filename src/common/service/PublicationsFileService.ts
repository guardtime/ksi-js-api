import {IPublicationsFile} from '../publication/IPublicationsFile';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {IPublicationsFileServiceProtocol, isPublicationsFileServiceProtocol} from './IPublicationsFileServiceProtocol';
import {KsiServiceError} from './KsiServiceError';

/**
 * Publications file service
 */
export class PublicationsFileService {
    private publicationsFileServiceProtocol: IPublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(publicationsFileServiceProtocol: IPublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        if (!(isPublicationsFileServiceProtocol(publicationsFileServiceProtocol))) {
            throw new KsiServiceError(`Invalid publications file service protocol: ${publicationsFileServiceProtocol}`);
        }

        if (!(publicationsFileFactory instanceof PublicationsFileFactory)) {
            throw new KsiServiceError(`Invalid publications file factory: ${publicationsFileFactory}`);
        }

        this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
        this.publicationsFileFactory = publicationsFileFactory;
    }

    public async getPublicationsFile(): Promise<IPublicationsFile> {
        return this.publicationsFileFactory.create(await this.publicationsFileServiceProtocol.getPublicationsFile());
    }
}
