/*
 * Copyright 2013-2022 Guardtime, Inc.
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

import { DataHash } from '@guardtime/common/lib/hash/DataHash.js';
import bigInteger, { BigInteger } from 'big-integer';
import { PublicationsFile } from '../publication/PublicationsFile.js';
import { CalendarHashChain } from '../signature/CalendarHashChain.js';
import { KsiSignature } from '../signature/KsiSignature.js';
import { ExtendingService } from './ExtendingService.js';
import { KsiServiceError } from './KsiServiceError.js';
import { PublicationsFileService } from './PublicationsFileService.js';
import { SigningService } from './SigningService.js';

/**
 * KSI service for signing, extending and fetching publications file.
 */
export class KsiService {
  private readonly signingService: SigningService | null;
  private readonly extendingService: ExtendingService | null;
  private readonly publicationsFileService: PublicationsFileService | null;

  /**
   * KSI service constructor.
   * @param signingService Signing service.
   * @param extendingService Extending service.
   * @param publicationsFileService Publications file service.
   */
  public constructor(
    signingService: SigningService | null = null,
    extendingService: ExtendingService | null = null,
    publicationsFileService: PublicationsFileService | null,
  ) {
    this.signingService = signingService;
    this.extendingService = extendingService;
    this.publicationsFileService = publicationsFileService;
  }

  /**
   * Sign given data hash.
   * @param hash Data hash.
   * @param level Base level for aggregation chain, by default 0.
   * @returns KSI signature promise.
   */
  public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
    if (!this.signingService) {
      throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
    }

    return this.signingService.sign(hash, level);
  }

  /**
   * Get calendar hash chain for given aggregation time and publication time.
   * @param aggregationTime Aggregation time.
   * @param publicationTime Publication time, by default null. If null, get most recent calendar record.
   * @returns Calendar hash chain promise.
   */
  public async extend(
    aggregationTime: BigInteger,
    publicationTime: BigInteger | null = null,
  ): Promise<CalendarHashChain> {
    if (!this.extendingService) {
      throw new KsiServiceError('Extending service not defined. Cannot use extending.');
    }

    return this.extendingService.extend(aggregationTime, publicationTime);
  }

  /**
   * Get publications file.
   * @returns Publications file promise.
   */
  public async getPublicationsFile(): Promise<PublicationsFile> {
    if (!this.publicationsFileService) {
      throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
    }

    return this.publicationsFileService.getPublicationsFile();
  }
}
