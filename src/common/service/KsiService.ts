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

import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger, { BigInteger } from 'big-integer';
import { PublicationsFile } from '../publication/PublicationsFile';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { KsiSignature } from '../signature/KsiSignature';
import { ExtendingService } from './ExtendingService';
import { KsiServiceError } from './KsiServiceError';
import { PublicationsFileService } from './PublicationsFileService';
import { SigningService } from './SigningService';

/**
 * KSI service.
 */
export class KsiService {
  private readonly signingService: SigningService | null;
  private readonly extendingService: ExtendingService | null;
  private readonly publicationsFileService: PublicationsFileService | null;

  constructor(
    signingService: SigningService | null = null,
    extendingService: ExtendingService | null = null,
    publicationsFileService: PublicationsFileService | null
  ) {
    this.signingService = signingService;
    this.extendingService = extendingService;
    this.publicationsFileService = publicationsFileService;
  }

  public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<KsiSignature> {
    if (!this.signingService) {
      throw new KsiServiceError('Signing protocol not defined. Cannot use signing.');
    }

    return this.signingService.sign(hash, level);
  }

  public async extend(
    aggregationTime: BigInteger,
    publicationTime: BigInteger | null = null
  ): Promise<CalendarHashChain> {
    if (!this.extendingService) {
      throw new KsiServiceError('Extending service not defined. Cannot use extending.');
    }

    return this.extendingService.extend(aggregationTime, publicationTime);
  }

  public async getPublicationsFile(): Promise<PublicationsFile> {
    if (!this.publicationsFileService) {
      throw new KsiServiceError('Publications file service not defined. Cannot get publications file.');
    }

    return this.publicationsFileService.getPublicationsFile();
  }
}
