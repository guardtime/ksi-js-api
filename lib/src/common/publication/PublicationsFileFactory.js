import { RawTag } from '../parser/RawTag';
import { compareTypedArray } from '../util/Array';
import { PublicationsFile } from './PublicationsFile';
import { PublicationsFileError } from './PublicationsFileError';
import { CMSVerification } from 'gt-js-common';
import CONFIG from "../../../config/ksi-config.js";
/**
 * Publications file factory for publications file creation from byte array
 */
export class PublicationsFileFactory {
    // noinspection JSMethodCanBeStatic
    create(publicationFileBytes) {
        const beginningMagicBytes = PublicationsFile.FileBeginningMagicBytes;
        if (!compareTypedArray(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)) {
            throw new PublicationsFileError('Publications file header is incorrect. Invalid publications file magic bytes.');
        }
        let pubFile = new PublicationsFile(RawTag.CREATE(0x0, false, false, publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));
        // TODO: Verification
        let verified = CMSVerification.verify(pubFile.getSignatureValue(), pubFile.getSignedBytes(), CONFIG.PUBLICATIONS_FILE_SIGNATURE_TRSUTED_CERTIFICATES.split(';'));
        if (!verified) {
            throw new PublicationsFileError("The signature on the publications file is not valid. ");
        }
        return pubFile;
    }
}
