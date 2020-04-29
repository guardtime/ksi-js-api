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
import { PublicationData } from '../../publication/PublicationData';
import { PublicationsFile } from '../../publication/PublicationsFile';
import { KsiService } from '../../service/KsiService';
import { CalendarHashChain } from '../CalendarHashChain';
import { KsiSignature } from '../KsiSignature';
import { KsiVerificationError } from './KsiVerificationError';

/**
 * Verification context for KSI signature.
 */
export class VerificationContext {
  private ksiService: KsiService | null = null;
  private readonly ksiSignature: KsiSignature;
  private documentHash: DataHash | null = null;
  private publicationsFile: PublicationsFile | null = null;
  private publicationData: PublicationData | null = null;
  private extendingAllowed = true;
  private documentHashLevel: BigInteger = bigInteger(0);

  /**
   * Verification context constructor.
   * @param signature KSI signature.
   */
  constructor(signature: KsiSignature) {
    this.ksiSignature = signature;
  }

  /**
   * Get KSI signature.
   * @returns KSI signature.
   */
  public getSignature(): KsiSignature {
    return this.ksiSignature;
  }

  /**
   * Get extended latest calendar hash chain.
   * @returns Extended latest calendar hash chain.
   */
  public async getExtendedLatestCalendarHashChain(): Promise<CalendarHashChain> {
    return this.getExtendedCalendarHashChain(null);
  }

  /**
   * Get extended calendar hash chain.
   * @param publicationTime Publication time, if not set get the latest calendar record.
   * @returns Calendar hash chain.
   */
  public async getExtendedCalendarHashChain(publicationTime: BigInteger | null): Promise<CalendarHashChain> {
    if (!this.ksiService) {
      throw new KsiVerificationError('Invalid KSI service in context.');
    }

    return this.ksiService.extend(this.getSignature().getAggregationTime(), publicationTime);
  }

  /**
   * Get document hash.
   * @returns Data hash if set, otherwise null.
   */
  public getDocumentHash(): DataHash | null {
    return this.documentHash;
  }

  /**
   * Set dodument hash.
   * @param documentHash Document hash.
   */
  public setDocumentHash(documentHash: DataHash | null): void {
    this.documentHash = documentHash;
  }

  /**
   * Set KSI service for getting extended calendar hash chain.
   * @param ksiService KSI service or null if extending is not used.
   */
  public setKsiService(ksiService: KsiService | null): void {
    this.ksiService = ksiService;
  }

  /**
   * Get document hash node level value in the aggregation tree.
   * @returns Document hash level.
   */
  public getDocumentHashLevel(): BigInteger {
    return this.documentHashLevel;
  }

  /**
   * Set document base hash level.
   * @param documentHashLevel document hash level.
   */
  public setDocumentHashLevel(documentHashLevel: BigInteger): void {
    this.documentHashLevel = documentHashLevel;
  }

  /**
   * Get publications file.
   * @returns Publications file or null if not set.
   */
  public getPublicationsFile(): PublicationsFile | null {
    return this.publicationsFile;
  }

  /**
   * Set publications file.
   * @param publicationsFile Publications file or null if not required.
   */
  public setPublicationsFile(publicationsFile: PublicationsFile | null): void {
    this.publicationsFile = publicationsFile;
  }

  /**
   * Get user publication data.
   * @returns User publication data.
   */
  public getUserPublication(): PublicationData | null {
    return this.publicationData;
  }

  /**
   * Set user publication data.
   * @param publicationData Publication data or null if not required.
   */
  public setUserPublication(publicationData: PublicationData | null): void {
    this.publicationData = publicationData;
  }

  /**
   * Is extending allowed.
   * @returns True if extending is allowed.
   */
  public isExtendingAllowed(): boolean {
    return this.extendingAllowed;
  }

  /**
   * Allow extending.
   * @param extendingAllowed Allow extending, true if allowed.
   */
  public setExtendingAllowed(extendingAllowed: boolean): void {
    this.extendingAllowed = extendingAllowed;
  }
}
