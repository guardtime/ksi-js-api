import {RawTag} from '../parser/RawTag';
import {compareTypedArray} from '../util/Array';
import {PublicationsFile} from './PublicationsFile';
import {PublicationsFileError} from './PublicationsFileError';
import {CMSVerification} from 'gt-js-common';
import DEFAULT_VALUES from '../../../config/default_gt_root_certificates.js';
import CONFIG from '../../../config/ksi-config.js';

/**
 * Publications file factory for publications file creation from byte array
 */
export class PublicationsFileFactory {
    private trustedCertificates: string[];

    constructor(trustedCertificates?: string) {
        if (typeof(trustedCertificates) !== 'undefined'){
            this.trustedCertificates = trustedCertificates.split(';');
        } else {
            this.trustedCertificates = DEFAULT_VALUES.TRUSTED_CERTIFICATES.split(';');
        }

    }

// noinspection JSMethodCanBeStatic
    public create(publicationFileBytes: Uint8Array): PublicationsFile {
        const beginningMagicBytes: Uint8Array = PublicationsFile.FileBeginningMagicBytes;
        if (!compareTypedArray(publicationFileBytes.slice(0, beginningMagicBytes.length), beginningMagicBytes)) {
            throw new PublicationsFileError(
                'Publications file header is incorrect. Invalid publications file magic bytes.');
        }

        const pubFile = new PublicationsFile(
            RawTag.CREATE(
                0x0,
                false,
                false,
                publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));

        let verified = CMSVerification.verify(pubFile.getSignatureValue(), pubFile.getSignedBytes(), this.trustedCertificates, CONFIG.CERTIFICATE_SUBJECT);

        if (!verified){
            throw new PublicationsFileError("The signature on the publications file is not valid. ");
        }

        return pubFile;
    }
}
