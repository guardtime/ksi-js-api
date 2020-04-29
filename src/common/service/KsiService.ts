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

import DataHash from '@guardtime/common/lib/hash/DataHash';
import bigInteger, { BigInteger } from 'big-integer';
import { PublicationsFile } from '../publication/PublicationsFile';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { KsiSignature } from '../signature/KsiSignature';
import { ExtendingService } from './ExtendingService';
import { KsiServiceError } from './KsiServiceError';
import { PublicationsFileService } from './PublicationsFileService';
import { SigningService } from './SigningService';

/**
 * KSI service for signing, extending and fetching publications file.
 */
export class KsiService {
  private readonly signingService: SigningService | null;
  private readonly extendingService: ExtendingService | null;
  private readonly publicationsFileService: PublicationsFileService | null;

  /**
   * KSI service constructor.
   * @param {SigningService} signingService Signing service.
   * @param {ExtendingService} extendingService Extending service.
   * @param {PublicationsFileService} publicationsFileService Publications file service.
   */
  constructor(
    signingService: SigningService | null = null,
    extendingService: ExtendingService | null = null,
    publicationsFileService: PublicationsFileService | null
  ) {
    this.signingService = signingService;
    this.extendingService = extendingService;
    this.publicationsFileService = publicationsFileService;
  }

  /**
   * Sign given data hash.
   * @param {DataHash} hash Data hash.
   * @param {BigInteger} level Base level for aggregation chain, by default its 0
   * @returns {Promise<KsiSignature>} KSI signature promise.
   */
  public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
    if (!this.signingService) {
      throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
    }

    return this.signingService.sign(hash, level);
  }

  /**
   * Get calendar hash chain for given aggregation time and publication time.
   * @param {BigInteger} aggregationTime Aggregation time.
   * @param {BigInteger|null} publicationTime Publication time, by default null. If null get most recent calendar record.
   * @returns {Promise<CalendarHashChain>} Calendar hash chain promise.
   */
  public async extend(
    aggregationTime: BigInteger,
    publicationTime: BigInteger | null = null
  ): Promise<CalendarHashChain> {
    if (!this.extendingService) {
      throw new KsiServiceError('Extending service not defined. Cannot use extending.');
    }

    return this.extendingService.extend(aggregationTime, publicationTime);
  }

  /**
   * Get publications file.
   * @returns {Promise<PublicationsFile>} Publications file promise.
   */
  public async getPublicationsFile(): Promise<PublicationsFile> {
    if (!this.publicationsFileService) {
      throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
    }

    return this.publicationsFileService.getPublicationsFile();
  }
}
