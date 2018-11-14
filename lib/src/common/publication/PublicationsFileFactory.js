import { RawTag } from '../parser/RawTag';
import { PublicationsFile } from './PublicationsFile';
import { PublicationsFileError } from './PublicationsFileError';
/**
 * Publications file factory for publications file creation from byte array
 */
var PublicationsFileFactory = /** @class */ (function () {
    function PublicationsFileFactory() {
    }
    PublicationsFileFactory.prototype.create = function (publicationFileBytes) {
        var beginningMagicBytes = PublicationsFile.FileBeginningMagicBytes;
        if (JSON.stringify(publicationFileBytes.slice(0, beginningMagicBytes.length)) !==
            JSON.stringify(beginningMagicBytes)) {
            throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
        }
        // TODO: Verification
        return new PublicationsFile(RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));
    };
    return PublicationsFileFactory;
}());
export { PublicationsFileFactory };
