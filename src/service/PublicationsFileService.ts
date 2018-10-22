import {IPublicationsFile} from '../publication/IPublicationsFile';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {KsiServiceError} from './KsiServiceError';
import {PublicationsFileServiceProtocol} from './PublicationsFileServiceProtocol';

/**
 * Publications file service
 */
export class PublicationsFileService {
    private publicationsFileServiceProtocol: PublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(publicationsFileServiceProtocol: PublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        if (!(publicationsFileServiceProtocol instanceof PublicationsFileServiceProtocol)) {
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
