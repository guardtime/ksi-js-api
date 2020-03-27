import { RawTag } from '../../src/common/parser/RawTag';
import { PublicationsFile } from '../../src/common/publication/PublicationsFile';
import { PublicationsFileError } from '../../src/common/publication/PublicationsFileError';
import { compareTypedArray } from '../../src/common/util/Array';

export class TestPublicationsFileFactory {
  public create(publicationFileBytes: Uint8Array): PublicationsFile {
    const beginningMagicBytes: Uint8Array = PublicationsFile.FileBeginningMagicBytes;
    if (!compareTypedArray(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)) {
      throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
    }

    return new PublicationsFile(
      RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length))
    );
  }
}
