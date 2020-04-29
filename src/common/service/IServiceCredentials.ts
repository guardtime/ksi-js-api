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

/**
 * Service credentials interface.
 */
export interface IServiceCredentials {
  /**
   * Get login ID.
   * @returns Login ID.
   */
  getLoginId(): string;

  /**
   * Get login key for HMAC.
   * @returns Login key.
   */
  getLoginKey(): Uint8Array;

  /**
   * Get login HMAC algorithm.
   * @returns HMAC algorithm.
   */
  getHmacAlgorithm(): HashAlgorithm;
}
