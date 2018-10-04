import {PublicationsFile} from 'src/publication/PublicationsFile';
import {PublicationsFileError} from 'src/publication/PublicationsFileError';
import {RawTag} from 'src/parser/RawTag';

export class PublicationsFileFactory {

    public create(publicationFileBytes: Uint8Array): PublicationsFile {
        if (JSON.stringify(publicationFileBytes.slice(0, PublicationsFile.FileBeginningMagicBytes.length - 1)) ===
            JSON.stringify(PublicationsFile.FileBeginningMagicBytes)) {
            throw new PublicationsFileError(
                'Publications file header is incorrect. Invalid publications file magic bytes.');
        }

        // TODO: Verification
        return new PublicationsFile(
            RawTag.CREATE(
                0x0,
                false,
                false,
                publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));;
    }
}
