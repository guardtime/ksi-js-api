import {RawTag} from '../parser/RawTag';
import {compareTypedArray} from '../util/Array';
import {PublicationsFile} from './PublicationsFile';
import {PublicationsFileError} from './PublicationsFileError';

/**
 * Publications file factory for publications file creation from byte array
 */
export class PublicationsFileFactory {

    public create(publicationFileBytes: Uint8Array): PublicationsFile {
        const beginningMagicBytes: Uint8Array = PublicationsFile.FileBeginningMagicBytes;
        if (!compareTypedArray(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)) {
            throw new PublicationsFileError(
                'Publications file header is incorrect. Invalid publications file magic bytes.');
        }

        // TODO: Verification
        return new PublicationsFile(
            RawTag.CREATE(
                0x0,
                false,
                false,
                publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));
    }
}
