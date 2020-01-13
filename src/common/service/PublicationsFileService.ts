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

import {PublicationsFile} from '../publication/PublicationsFile';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {IPublicationsFileServiceProtocol} from './IPublicationsFileServiceProtocol';

/**
 * Publications file service
 */
export class PublicationsFileService {
    private publicationsFileServiceProtocol: IPublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(publicationsFileServiceProtocol: IPublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
        this.publicationsFileFactory = publicationsFileFactory;
    }

    public async getPublicationsFile(): Promise<PublicationsFile> {
        return this.publicationsFileFactory.create(await this.publicationsFileServiceProtocol.getPublicationsFile());
    }
}
