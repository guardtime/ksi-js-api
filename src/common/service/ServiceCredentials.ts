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

import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { IServiceCredentials } from './IServiceCredentials';

/**
 * Service credentials for KSI service.
 */
export class ServiceCredentials implements IServiceCredentials {
  private readonly hmacAlgorithm: HashAlgorithm;
  private readonly loginId: string;
  private readonly loginKey: Uint8Array;

  /**
   * Service credentials constructor.
   * @param {string} loginId Login ID.
   * @param {Uint8Array} loginKey Login key for HMAC calculation.
   * @param {HashAlgorithm} hmacAlgorithm HMAC algorithm, by default algorithm defined in js-common dependency HashAlgorithm.DEFAULT.
   */
  constructor(loginId: string, loginKey: Uint8Array, hmacAlgorithm: HashAlgorithm = HashAlgorithm.DEFAULT) {
    this.loginId = loginId;
    this.loginKey = loginKey;
    this.hmacAlgorithm = hmacAlgorithm;
  }

  /**
   * @inheritDoc
   */
  public getHmacAlgorithm(): HashAlgorithm {
    return this.hmacAlgorithm;
  }

  /**
   * @inheritDoc
   */
  public getLoginId(): string {
    return this.loginId;
  }

  /**
   * @inheritDoc
   */
  public getLoginKey(): Uint8Array {
    return this.loginKey;
  }
}
