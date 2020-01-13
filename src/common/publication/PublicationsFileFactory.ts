/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import {RawTag} from '../parser/RawTag';
import {compareTypedArray} from '../util/Array';
import {PublicationsFile} from './PublicationsFile';
import {PublicationsFileError} from './PublicationsFileError';

/**
 * Publications file factory for publications file creation from byte array
 */
export class PublicationsFileFactory {

    // noinspection JSMethodCanBeStatic
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
