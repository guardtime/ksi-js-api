/*
 * Copyright 2013-2020 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import { PublicationsFile } from '../publication/PublicationsFile.js';
import { PublicationsFileFactory } from '../publication/PublicationsFileFactory.js';
import { IPublicationsFileServiceProtocol } from './IPublicationsFileServiceProtocol.js';
/**
 * Publications file service.
 */
export class PublicationsFileService {
  private publicationsFileServiceProtocol: IPublicationsFileServiceProtocol;
  private publicationsFileFactory: PublicationsFileFactory;

  /**
   * Publications file service constructor.
   * @param publicationsFileServiceProtocol Publications file service protocol.
   * @param publicationsFileFactory Publications file factory for publications file creation.
   */
  public constructor(
    publicationsFileServiceProtocol: IPublicationsFileServiceProtocol,
    publicationsFileFactory: PublicationsFileFactory
  ) {
    this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
    this.publicationsFileFactory = publicationsFileFactory;
  }

  /**
   * Get publications file.
   * @returns Publications file promise.
   */
  public async getPublicationsFile(): Promise<PublicationsFile> {
    return this.publicationsFileFactory.create(await this.publicationsFileServiceProtocol.getPublicationsFile());
  }
}
