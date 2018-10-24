import { RawTag } from '../parser/RawTag';
import { PublicationsFile } from './PublicationsFile';
import { PublicationsFileError } from './PublicationsFileError';
/**
 * Publications file factory for publications file creation from byte array
 */
export class PublicationsFileFactory {
    create(publicationFileBytes) {
        if (JSON.stringify(publicationFileBytes.slice(0, PublicationsFile.FileBeginningMagicBytes.length - 1)) ===
            JSON.stringify(PublicationsFile.FileBeginningMagicBytes)) {
            throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
        }
        // TODO: Verification
        return new PublicationsFile(RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));
    }
}